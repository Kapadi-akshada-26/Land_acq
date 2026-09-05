const fs = require('fs');
const path = require('path');

const districtCoords = {
  'Palghar': [19.6967, 72.7699],
  'Thane': [19.2183, 72.9781],
  'Vapi': [20.3718, 72.9106],
  'Surat': [21.1702, 72.8311],
  'Vadodara': [22.3072, 73.1812],
  'Ahmedabad': [23.0225, 72.5714],
  'Karnal': [29.6857, 76.9905],
  'Jalandhar': [31.3260, 75.5762],
  'Amritsar': [31.6340, 74.8723],
  'Udhampur': [32.9250, 75.1416],
  'Reasi': [33.0827, 74.8322],
  'Dwarka': [28.5921, 77.0460],
  'Gurugram': [28.4595, 77.0266],
  'Bengaluru': [12.9716, 77.5946],
  'Tirupati': [13.6288, 79.4192],
  'Vellore': [12.9165, 79.1325],
  'Patiala': [30.3398, 76.3869],
  'Jodhpur': [26.2389, 73.0243],
  'Rajkot': [22.3039, 70.8022],
  'Bastar': [19.1071, 81.9535],
  'Koraput': [18.8135, 82.7123],
  'Visakhapatnam': [17.6868, 83.2185],
  'Prayagraj': [25.4358, 81.8463],
  'Varanasi': [25.3176, 82.9739],
  'Gaya': [24.7955, 85.0002],
  'Kota': [25.2138, 75.8648],
  'Panipat': [29.3909, 76.9635],
  'Faridabad': [28.4089, 77.3178],
  'Jaipur': [26.9124, 75.7873],
  'Alwar': [27.5530, 76.6346],
  'Indore': [22.7196, 75.8577],
  'Noida': [28.5355, 77.3910],
  'Dehradun': [30.3165, 78.0322],
  'Haridwar': [29.9457, 78.1642],
  'Nainital': [29.3919, 79.4542],
  'Lucknow': [26.8467, 80.9462],
  'Bhubaneswar': [20.2961, 85.8245],
  'Howrah': [22.5958, 88.2636],
  'Agra': [27.1767, 78.0081],
  'Nizamabad': [18.6725, 78.0941],
  'Dibrugarh': [27.4728, 94.9120],
  'Mandi': [31.5892, 76.9182],
  'Coimbatore': [11.0168, 76.9558],
  'Durg': [21.1904, 81.2849],
  'Silchar': [24.8170, 92.7985],
  'Guntur': [16.3067, 80.4365],
  'Jamshedpur': [22.8046, 86.2029],
  'Vijayawada': [16.5062, 80.6480],
  'Bilaspur': [22.0797, 82.1409],
  'Raipur': [21.2514, 81.6296],
  'Thiruvananthapuram': [8.5241, 76.9366],
  'Hyderabad': [17.3850, 78.4867],
  'Srinagar': [34.0837, 74.7973],
  'Kangra': [32.0998, 76.2691],
  'Sambalpur': [21.4669, 83.9812],
  'Dhanbad': [23.7957, 86.4304],
  'Jabalpur': [23.1815, 79.9864],
  'Kozhikode': [11.2588, 75.7804],
  'Tiruchirappalli': [10.7905, 78.7047],
  'Bhopal': [23.2599, 77.4126],
  'Bhagalpur': [25.2425, 86.9842],
  'Chaibasa': [22.5516, 85.8083],
  'Shahdara': [28.6738, 77.2917],
  'Nashik': [19.9975, 73.7898],
  'Cuttack': [20.4625, 85.8828],
  'Jammu': [32.7266, 74.8570],
  'Kochi': [9.9312, 76.2673],
  'Hubballi': [15.3647, 75.1240],
  'Belagavi': [15.8497, 74.4977],
  'Nagpur': [21.1458, 79.0882],
  'Ranchi': [23.3441, 85.3096],
  'Ludhiana': [30.9010, 75.8573],
  'Warangal': [17.9689, 79.5941],
  'Meerut': [28.9845, 77.7064],
  'New Delhi': [28.6139, 77.2090],
  'Shimla': [31.1048, 77.1734],
  'Bhavnagar': [21.7645, 72.1519],
  'Ujjain': [23.1765, 75.7885],
  'Mysuru': [12.2958, 76.6394],
  'Ghaziabad': [28.6692, 77.4538],
  'Siliguri': [26.7271, 88.3953],
  'Chennai': [13.0827, 80.2707],
  'Madurai': [9.9252, 78.1198],
  'Kolkata': [22.5726, 88.3639],
  'Aurangabad': [19.8762, 75.3433],
  'Raigad': [18.5158, 73.1822],
  'Guwahati': [26.1445, 91.7362],
  'Udaipur': [24.5854, 73.7125],
  'Durgapur': [23.5204, 87.3119],
  'Muzaffarpur': [26.1209, 85.3647],
  'Gwalior': [26.2183, 78.1828],
  'Rourkela': [22.2604, 84.8536],
  'Patna': [25.5941, 85.1376],
  'Pune': [18.5204, 73.8567],
  'Keonjhar': [21.6289, 85.5817]
};

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const csvPath = path.join(__dirname, '..', 'src', 'data', 'land_acquisition_hybrid_dataset.csv');
const content = fs.readFileSync(csvPath, 'utf8');
const rawLines = content.split('\n').filter(l => l.trim().length > 0);

const projectMap = new Map();
const allSnapshots = [];

for (let i = 1; i < rawLines.length; i++) {
  const p = parseCSVLine(rawLines[i]);
  if (p.length < 20) continue;
  
  const id = p[0];
  const state = p[1];
  const projectType = p[2];
  const totalLand = parseFloat(p[3]) || 0;
  const landAcquiredPct = parseFloat(p[4]) || 0;
  const pendingApprovals = parseInt(p[5]) || 0;
  const compensationPendingPct = parseFloat(p[6]) || 0;
  const legalCases = parseInt(p[7]) || 0;
  const affectedFamilies = parseInt(p[8]) || 0;
  const rrCompletedPct = parseFloat(p[9]) || 0;
  const possessionPct = parseFloat(p[10]) || 0;
  const plannedDuration = parseInt(p[11]) || 0;
  const envClearance = p[12];
  const forestClearance = p[13];
  const previousDelayDays = parseInt(p[14]) || 0;
  const delayDays = parseInt(p[15]) || 0;
  let riskLevel = p[16] || 'Low';
  if (riskLevel === 'High' && delayDays > 450) riskLevel = 'Critical';
  
  const projectStatus = p[17];
  const year = parseInt(p[18]) || 2024;
  const district = p[19];
  const name = p[20] || 'Infrastructure Project';
  const ministry = p[23] || 'Central Govt';
  const keyEvent = p[24] || 'Routine Progress';
  const urbanRural = p[25] || 'Rural';
  
  // Calculate top delay driver
  let topDriver = 'Documentation';
  if (legalCases > 0 || keyEvent.includes('Court') || keyEvent.includes('Litigation')) {
    topDriver = 'Legal Disputes';
  } else if (compensationPendingPct > 60) {
    topDriver = 'Compensation Pending';
  } else if (forestClearance === 'Pending' || forestClearance === 'Required') {
    topDriver = 'Forest Clearance';
  } else if (pendingApprovals > 2) {
    topDriver = 'Pending Approvals';
  } else if (rrCompletedPct < 40 && affectedFamilies > 50) {
    topDriver = 'R&R Incomplete';
  } else if (envClearance === 'Pending') {
    topDriver = 'Environmental Clearance';
  }
  
  // Stage determination
  let currentStage = 'SIA';
  if (possessionPct >= 80) currentStage = 'Possession';
  else if (compensationPendingPct <= 30 && landAcquiredPct > 60) currentStage = 'Compensation';
  else if (landAcquiredPct > 50) currentStage = 'Award';
  else if (envClearance === 'Approved' && totalLand > 0) currentStage = 'Declaration';
  else if (landAcquiredPct > 10) currentStage = 'Notification';
  
  // Deterministic scatter around district center
  const baseCoord = districtCoords[district] || [20.5937, 78.9629];
  let hash = 0;
  for (let j = 0; j < id.length; j++) hash = (hash << 5) - hash + id.charCodeAt(j);
  const latOffset = ((Math.abs(hash) % 100) - 50) * 0.0018;
  const lngOffset = (((Math.abs(hash >> 3)) % 100) - 50) * 0.0018;
  
  // Delay Probability (0-100)
  let delayProb = Math.min(99, Math.max(12, Math.round((delayDays / 750) * 80 + (riskLevel === 'Critical' ? 30 : riskLevel === 'High' ? 20 : riskLevel === 'Medium' ? 10 : 0))));
  if (delayProb > 98) delayProb = 98;
  
  const record = {
    id,
    name,
    state,
    district,
    projectType,
    currentStage,
    delayProbability: delayProb,
    riskLevel,
    topDelayDriver: topDriver,
    landAcquiredPct: Math.round(landAcquiredPct),
    landPossessionPct: Math.round(possessionPct),
    compensationPendingPct: Math.round(compensationPendingPct),
    rrCompletionPct: Math.round(rrCompletedPct),
    pendingApprovals,
    legalDisputes: legalCases,
    ownershipDisputes: Math.floor(legalCases * 0.4),
    affectedFamilies,
    displacedFamilies: Math.round(affectedFamilies * 0.3),
    expectedDelayDays: delayDays,
    totalLandRequired: totalLand,
    environmentalClearance: envClearance,
    forestClearance,
    ministry,
    keyEvent,
    urbanRural,
    year,
    lat: +(baseCoord[0] + latOffset).toFixed(5),
    lng: +(baseCoord[1] + lngOffset).toFixed(5)
  };
  
  allSnapshots.push(record);
  
  const existing = projectMap.get(id);
  if (!existing || year >= existing.year) {
    projectMap.set(id, record);
  }
}

const latestProjects = Array.from(projectMap.values());

// Calculate Stats
const totalProjects = latestProjects.length;
const critical = latestProjects.filter(p => p.riskLevel === 'Critical').length;
const high = latestProjects.filter(p => p.riskLevel === 'High').length;
const medium = latestProjects.filter(p => p.riskLevel === 'Medium').length;
const low = latestProjects.filter(p => p.riskLevel === 'Low').length;
const avgProb = +(latestProjects.reduce((acc, p) => acc + p.delayProbability, 0) / totalProjects).toFixed(1);

const stats = {
  totalProjects,
  criticalHighRisk: critical + high,
  mediumRisk: medium,
  onTrack: low,
  avgDelayProbability: avgProb
};

// Calculate Risk Distribution
const riskDistribution = [
  { level: 'Critical', count: critical, percentage: +((critical / totalProjects) * 100).toFixed(1) },
  { level: 'High', count: high, percentage: +((high / totalProjects) * 100).toFixed(1) },
  { level: 'Medium', count: medium, percentage: +((medium / totalProjects) * 100).toFixed(1) },
  { level: 'Low', count: low, percentage: +((low / totalProjects) * 100).toFixed(1) },
];

// Calculate Delay Drivers
const driverCounts = {};
latestProjects.forEach(p => {
  driverCounts[p.topDelayDriver] = (driverCounts[p.topDelayDriver] || 0) + 1;
});
const delayDrivers = Object.entries(driverCounts)
  .map(([name, projectCount]) => ({
    name,
    projectCount,
    percentage: Math.round((projectCount / totalProjects) * 100)
  }))
  .sort((a, b) => b.projectCount - a.projectCount);

// Calculate State Trends
const stateMap = {};
latestProjects.forEach(p => {
  if (!stateMap[p.state]) stateMap[p.state] = { name: p.state, probs: [], highRiskCount: 0 };
  stateMap[p.state].probs.push(p.delayProbability);
  if (p.riskLevel === 'Critical' || p.riskLevel === 'High') stateMap[p.state].highRiskCount++;
});
const stateTrends = Object.values(stateMap)
  .map(s => ({
    name: s.name,
    avgDelayProbability: Math.round(s.probs.reduce((a, b) => a + b, 0) / s.probs.length),
    projectCount: s.probs.length,
    highRiskCount: s.highRiskCount
  }))
  .sort((a, b) => b.projectCount - a.projectCount)
  .slice(0, 10);

// Calculate District Trends
const distMap = {};
latestProjects.forEach(p => {
  const key = `${p.district}__${p.state}`;
  if (!distMap[key]) distMap[key] = { name: p.district, state: p.state, probs: [] };
  distMap[key].probs.push(p.delayProbability);
});
const districtTrends = Object.values(distMap)
  .map(d => ({
    name: d.name,
    state: d.state,
    avgDelayProbability: Math.round(d.probs.reduce((a, b) => a + b, 0) / d.probs.length),
    projectCount: d.probs.length
  }))
  .sort((a, b) => b.avgDelayProbability - a.avgDelayProbability)
  .slice(0, 10);

// Calculate Project Type Trends
const typeMap = {};
latestProjects.forEach(p => {
  if (!typeMap[p.projectType]) typeMap[p.projectType] = { type: p.projectType, probs: [], delays: [], highRisk: 0 };
  typeMap[p.projectType].probs.push(p.delayProbability);
  typeMap[p.projectType].delays.push(p.expectedDelayDays);
  if (p.riskLevel === 'Critical' || p.riskLevel === 'High') typeMap[p.projectType].highRisk++;
});
const projectTypeTrends = Object.values(typeMap).map(t => ({
  type: t.type,
  avgDelayProbability: Math.round(t.probs.reduce((a, b) => a + b, 0) / t.probs.length),
  totalProjects: t.probs.length,
  highRisk: t.highRisk,
  avgDelayDays: Math.round(t.delays.reduce((a, b) => a + b, 0) / t.delays.length)
}));

// Real Alerts derived from critical / high risk projects with active court stays or high delay
const alerts = latestProjects
  .filter(p => p.riskLevel === 'Critical' || (p.riskLevel === 'High' && p.legalDisputes > 0) || p.expectedDelayDays > 400)
  .slice(0, 15)
  .map((p, idx) => ({
    id: `ALT-${String(idx + 1).padStart(3, '0')}`,
    projectId: p.id,
    projectName: p.name,
    district: p.district,
    state: p.state,
    description: `Risk escalated to ${p.delayProbability}%. Key trigger: ${p.keyEvent || p.topDelayDriver} (${p.expectedDelayDays} days delay expected).`,
    severity: p.riskLevel,
    date: new Date(Date.now() - (idx + 1) * 3600000 * 3).toISOString(),
    status: idx === 0 ? 'Open' : idx % 2 === 0 ? 'Under Review' : 'Open'
  }));

const outData = {
  stats,
  riskDistribution,
  delayDrivers,
  stateTrends,
  districtTrends,
  projectTypeTrends,
  alerts,
  projects: latestProjects
};

const outPath = path.join(__dirname, '..', 'src', 'data', 'processedProjects.json');
fs.writeFileSync(outPath, JSON.stringify(outData, null, 2));
console.log('Successfully generated processedProjects.json!');
console.log('Saved', latestProjects.length, 'projects.');
