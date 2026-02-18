/**
 * Edge Function: 占星計算（獨立拆分）
 *
 * 使用 astronomy-engine (npm) 計算本命盤。
 * Deno 環境透過 npm: specifier 導入。
 */

import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createLogger, generateRequestId } from '../_shared/logger.ts';

const logger = createLogger('compute-astrology');

// ============================================
// Types (inlined from @oath/shared)
// ============================================

type ZodiacSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer'
  | 'leo' | 'virgo' | 'libra' | 'scorpio'
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

type Planet =
  | 'sun' | 'moon' | 'mercury' | 'venus' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto'
  | 'ascendant' | 'midheaven';

type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  degree: number;
  signDegree: number;
  house: number;
  isRetrograde: boolean;
}

interface AspectData {
  planet1: Planet;
  planet2: Planet;
  type: AspectType;
  angle: number;
  orb: number;
  isApplying: boolean;
}

interface AstrologyData {
  sun: PlanetPosition;
  moon: PlanetPosition;
  ascendant: PlanetPosition;
  planets: PlanetPosition[];
  aspects: AspectData[];
  houseCusps: number[];
}

// ============================================
// Constants
// ============================================

const ASPECT_ORBS = { conjunction: 8, sextile: 6, square: 7, trine: 8, opposition: 8 };
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const OBLIQUITY = 23.4393;

const SIGNS: ZodiacSign[] = [
  'aries', 'taurus', 'gemini', 'cancer',
  'leo', 'virgo', 'libra', 'scorpio',
  'sagittarius', 'capricorn', 'aquarius', 'pisces',
];

// ============================================
// Core computation (astronomy-engine will be loaded dynamically)
// ============================================

function degreeToSign(degree: number): ZodiacSign {
  return SIGNS[Math.floor(((degree % 360) + 360) % 360 / 30) % 12]!;
}

function normalizeArc(arc: number): number {
  return ((arc % 360) + 360) % 360;
}

function angularDistance(deg1: number, deg2: number): number {
  let diff = Math.abs(deg1 - deg2);
  if (diff > 180) diff = 360 - diff;
  return diff;
}

// deno-lint-ignore no-explicit-any
function computeChart(Astronomy: any, birthDatetime: Date, latitude: number, longitude: number): AstrologyData {
  // 1. House calculation (Placidus simplified)
  const time = Astronomy.MakeTime(birthDatetime);
  const gstHours = Astronomy.SiderealTime(time);
  const lstHours = gstHours + longitude / 15;
  let ramc = (lstHours * 15) % 360;
  if (ramc < 0) ramc += 360;

  // ASC
  const ramcRad = ramc * DEG2RAD;
  const latRad = latitude * DEG2RAD;
  const oblRad = OBLIQUITY * DEG2RAD;
  const ascY = -Math.cos(ramcRad);
  const ascX = Math.sin(ramcRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  const asc = normalizeArc(Math.atan2(ascY, ascX) * RAD2DEG);

  // MC
  const mc = normalizeArc(Math.atan2(Math.sin(ramcRad), Math.cos(ramcRad) * Math.cos(oblRad)) * RAD2DEG);

  // Placidus houses
  const cusps = new Array<number>(12);
  cusps[0] = asc;
  cusps[9] = mc;
  cusps[6] = (asc + 180) % 360;
  cusps[3] = (mc + 180) % 360;
  const mcToAsc = normalizeArc(asc - mc);
  cusps[10] = (mc + mcToAsc / 3) % 360;
  cusps[11] = (mc + (mcToAsc * 2) / 3) % 360;
  const ic = cusps[3]!;
  const ascToIc = normalizeArc(ic - asc);
  cusps[1] = (asc + ascToIc / 3) % 360;
  cusps[2] = (asc + (ascToIc * 2) / 3) % 360;
  const dsc = cusps[6]!;
  const icToDsc = normalizeArc(dsc - ic);
  cusps[4] = (ic + icToDsc / 3) % 360;
  cusps[5] = (ic + (icToDsc * 2) / 3) % 360;
  const dscToMc = normalizeArc(mc - dsc);
  cusps[7] = (dsc + dscToMc / 3) % 360;
  cusps[8] = (dsc + (dscToMc * 2) / 3) % 360;
  const normalizedCusps = cusps.map((c) => normalizeArc(c));

  // Determine house for a longitude
  function getHouse(lon: number): number {
    for (let i = 0; i < 12; i++) {
      const cur = normalizedCusps[i]!;
      const next = normalizedCusps[(i + 1) % 12]!;
      if (next > cur) {
        if (lon >= cur && lon < next) return i + 1;
      } else {
        if (lon >= cur || lon < next) return i + 1;
      }
    }
    return 1;
  }

  // Check retrograde
  function isRetrograde(body: string): boolean {
    if (body === 'Sun' || body === 'Moon') return false;
    try {
      const dayBefore = new Date(birthDatetime.getTime() - 86400000);
      const dayAfter = new Date(birthDatetime.getTime() + 86400000);
      const vecBefore = Astronomy.GeoVector(body, dayBefore, true);
      const vecAfter = Astronomy.GeoVector(body, dayAfter, true);
      const eclBefore = Astronomy.Ecliptic(vecBefore);
      const eclAfter = Astronomy.Ecliptic(vecAfter);
      let diff = eclAfter.elon - eclBefore.elon;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      return diff < 0;
    } catch { return false; }
  }

  // 2. Planet positions
  const bodyMap: Record<string, string> = {
    sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus',
    mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn',
    uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto',
  };

  const positions: PlanetPosition[] = [];
  for (const [name, bodyName] of Object.entries(bodyMap)) {
    let lon: number;
    if (bodyName === 'Sun') {
      lon = Astronomy.SunPosition(birthDatetime).elon;
    } else {
      const vec = Astronomy.GeoVector(bodyName, birthDatetime, true);
      lon = Astronomy.Ecliptic(vec).elon;
    }
    lon = normalizeArc(lon);
    positions.push({
      planet: name as Planet,
      sign: degreeToSign(lon),
      degree: lon,
      signDegree: lon % 30,
      house: getHouse(lon),
      isRetrograde: isRetrograde(bodyName),
    });
  }

  // 3. Aspects
  const aspectDefs: { type: AspectType; angle: number; orb: number }[] = [
    { type: 'conjunction', angle: 0, orb: ASPECT_ORBS.conjunction },
    { type: 'sextile', angle: 60, orb: ASPECT_ORBS.sextile },
    { type: 'square', angle: 90, orb: ASPECT_ORBS.square },
    { type: 'trine', angle: 120, orb: ASPECT_ORBS.trine },
    { type: 'opposition', angle: 180, orb: ASPECT_ORBS.opposition },
  ];
  const aspects: AspectData[] = [];
  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i]!;
      const p2 = positions[j]!;
      const dist = angularDistance(p1.degree, p2.degree);
      for (const def of aspectDefs) {
        const orb = Math.abs(dist - def.angle);
        if (orb <= def.orb) {
          aspects.push({ planet1: p1.planet, planet2: p2.planet, type: def.type, angle: dist, orb, isApplying: orb < def.orb / 2 });
          break;
        }
      }
    }
  }

  // 4. ASC & MC as PlanetPositions
  const sun = positions.find((p) => p.planet === 'sun')!;
  const moon = positions.find((p) => p.planet === 'moon')!;
  const ascPos: PlanetPosition = { planet: 'ascendant', sign: degreeToSign(asc), degree: asc, signDegree: asc % 30, house: 1, isRetrograde: false };
  const mcPos: PlanetPosition = { planet: 'midheaven', sign: degreeToSign(mc), degree: mc, signDegree: mc % 30, house: 10, isRetrograde: false };

  return {
    sun, moon, ascendant: ascPos,
    planets: [...positions, ascPos, mcPos],
    aspects,
    houseCusps: normalizedCusps,
  };
}

// ============================================
// Edge Function Handler
// ============================================

// @ts-expect-error Deno runtime
Deno.serve(async (req: Request) => {
  const corsRes = handleCors(req);
  if (corsRes) return corsRes;

  if (req.method !== 'POST') {
    return errorResponse('GEN_002', 'Method not allowed', 405, generateRequestId());
  }

  const requestId = generateRequestId();
  const timer = logger.startTimer();

  try {
    // Dynamic import for npm package (Deno)
    const Astronomy = await import('npm:astronomy-engine@2.1.19');

    const body = await req.json();
    const { birthDatetime, latitude, longitude } = body as {
      birthDatetime: string;
      latitude: number;
      longitude: number;
    };

    if (!birthDatetime || latitude == null || longitude == null) {
      return errorResponse('VAL_003', 'Missing required fields: birthDatetime, latitude, longitude', 400, requestId);
    }

    const date = new Date(birthDatetime);
    if (isNaN(date.getTime())) {
      return errorResponse('VAL_001', 'Invalid birthDatetime format', 400, requestId);
    }

    logger.info('engine.compute', 'Computing astrology chart', { requestId });

    const astrologyData = computeChart(Astronomy, date, latitude, longitude);
    const durationMs = timer();

    logger.info('engine.compute', 'Astrology chart computed', { requestId, durationMs });

    return jsonResponse({
      success: true,
      data: astrologyData,
      engineVersion: '1.0.0',
      computedAt: new Date().toISOString(),
      requestId,
    });
  } catch (err) {
    const durationMs = timer();
    logger.error('engine.error', `Astrology computation failed: ${err}`, { requestId, durationMs });
    return errorResponse('ENG_001', 'Astrology computation failed', 500, requestId, {
      detail: String(err),
    });
  }
});
