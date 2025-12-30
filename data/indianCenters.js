// All Indian Vipassana centers with their location IDs from dhamma.org
// Use location_XXXX in regions parameter to fetch courses for specific centers

export const INDIAN_CENTERS = {
  1315: { name: 'Dhamma Ārāma (Dhammārāma)', city: 'Kumudavalli Village', state: 'Andhra Pradesh', subdomain: 'rama' },
  1316: { name: 'Dhamma Koṇdañña', city: 'Sanga Reddy', state: 'Telangana', subdomain: 'kondanna' },
  1318: { name: 'Dhamma Nijjhāna', city: 'Nizamabad', state: 'Telangana', subdomain: 'nijjhana' },
  1348: { name: 'Dhamma Upavana', city: 'Bara Chakia', state: 'Bihar', subdomain: 'upavana' },
  1364: { name: 'Dhamma Ketu', city: 'Durg', state: 'Chhattisgarh', subdomain: 'ketu' },
  1406: { name: 'Dhamma Sindhu', city: 'Kutch', state: 'Gujarat', subdomain: 'sindhu' },
  1407: { name: 'Dhamma Divākara', city: 'Mehsana', state: 'Gujarat', subdomain: 'divakara' },
  1408: { name: 'Dhamma Koṭa', city: 'Rajkot', state: 'Gujarat', subdomain: 'kota' },
  1415: { name: 'Dhamma Laddha', city: 'Leh', state: 'Ladakh', subdomain: 'laddha' },
  1418: { name: 'Dhamma Ketana', city: 'Chengannur', state: 'Kerala', subdomain: 'ketana' },
  1433: { name: 'Dhamma Pāla', city: 'Bhopal', state: 'Madhya Pradesh', subdomain: 'pala' },
  1436: { name: 'Dhamma Rata', city: 'Ratlam', state: 'Madhya Pradesh', subdomain: 'rata' },
  1437: { name: 'Dhamma Ajaya', city: 'Ajaypur', state: 'Maharashtra', subdomain: 'ajaya' },
  1438: { name: 'Dhamma Anākula', city: 'Akola', state: 'Maharashtra', subdomain: 'anakula' },
  1439: { name: 'Dhamma Ajantā', city: 'Aurangabad', state: 'Maharashtra', subdomain: 'ajanta' },
  1441: { name: 'Dhamma Sarovara', city: 'Dhule', state: 'Maharashtra', subdomain: 'sarovara' },
  1446: { name: 'Dhamma Ālaya', city: 'Kolhapur', state: 'Maharashtra', subdomain: 'alaya' },
  1448: { name: 'Dhamma Nāga', city: 'Nagpur', state: 'Maharashtra', subdomain: 'naga' },
  1450: { name: 'Dhamma Nāsikā', city: 'Nashik', state: 'Maharashtra', subdomain: 'nasika' },
  1451: { name: 'Dhamma Puṇṇa', city: 'Pune', state: 'Maharashtra', subdomain: 'punna' },
  1454: { name: 'Dhamma Vipula', city: 'Navi Mumbai', state: 'Maharashtra', subdomain: 'vipula' },
  1456: { name: 'Dhamma Malla', city: 'Yavatmal', state: 'Maharashtra', subdomain: 'malla' },
  1503: { name: 'Dhamma Dhaja', city: 'Hoshiarpur', state: 'Punjab', subdomain: 'dhaja' },
  1505: { name: 'Dhamma Pubbaja', city: 'Churu', state: 'Rajasthan', subdomain: 'pubbaja' },
  1506: { name: 'Dhamma Thalī', city: 'Jaipur', state: 'Rajasthan', subdomain: 'thali' },
  1507: { name: 'Dhamma Marudhara', city: 'Jodhpur', state: 'Rajasthan', subdomain: 'marudhara' },
  1551: { name: 'Dhamma Lakkhaṇa', city: 'Lucknow', state: 'Uttar Pradesh', subdomain: 'lakkhana' },
  1553: { name: 'Dhamma Suvatthi', city: 'Sravasti', state: 'Uttar Pradesh', subdomain: 'suvatthi' },
  1575: { name: 'Dhamma Sikkim', city: 'Gangtok', state: 'Sikkim', subdomain: 'sikkim' },
  1598: { name: 'Dhamma Utkal', city: 'Khariar Road', state: 'Odisha', subdomain: 'utkal' },
  1602: { name: 'Dhamma Niranjana', city: 'Nanded', state: 'Maharashtra', subdomain: 'niranjana' },
  1603: { name: 'Dhamma Āvāsa', city: 'Latur', state: 'Maharashtra', subdomain: 'avasa' },
  1610: { name: 'Dhamma Hitkari', city: 'Rohtak', state: 'Haryana', subdomain: 'hitkari' },
  1624: { name: 'Dhamma Vāṭikā', city: 'Palghar', state: 'Maharashtra', subdomain: 'vatika' },
  1628: { name: 'Dhamma Bhanḍāra', city: 'Bhandara', state: 'Maharashtra', subdomain: 'bhandara' },
  1634: { name: 'Dhamma Guna', city: 'Guna', state: 'Madhya Pradesh', subdomain: 'guna' },
  1639: { name: 'Dhamma Garh', city: 'Bilaspur', state: 'Chhattisgarh', subdomain: 'garh' },
  1641: { name: 'Dhamma Kaya', city: 'Kushinagar', state: 'Uttar Pradesh', subdomain: 'kaya' },
  1675: { name: 'Dhamma Sudha', city: 'Hastinapur', state: 'Uttar Pradesh', subdomain: 'sudha' },
  1676: { name: 'Dhamma Pāṭaliputta', city: 'Patna', state: 'Bihar', subdomain: 'patliputta' },
  1697: { name: 'Dhamma Siddhapuri', city: 'Solapur', state: 'Maharashtra', subdomain: 'siddhapuri' },
  1769: { name: 'Dhamma Nāgājjuna', city: 'Nagarjun Sagar', state: 'Telangana', subdomain: 'nagajjuna1' },
  1850: { name: 'Global Vipassana Pagoda', city: 'Mumbai', state: 'Maharashtra', subdomain: 'globalpagoda' },
  1852: { name: 'Dhamma Anurakkhi', city: 'Pulivendula', state: 'Andhra Pradesh', subdomain: 'anurakkhi' },
  1861: { name: 'Dhamma Kanheri', city: 'Mumbai', state: 'Maharashtra', subdomain: 'kanheri' },
  1862: { name: 'Dhamma Paṭhāra', city: 'Ahmednagar', state: 'Maharashtra', subdomain: 'pathara' },
  1866: { name: 'Dhamma Teera', city: 'Mahabubnagar', state: 'Telangana', subdomain: 'teera' },
  1877: { name: 'Dhamma Udaka', city: 'Dapoli', state: 'Maharashtra', subdomain: 'udaka' },
  2146: { name: 'Dhamma Aravalli', city: 'Modasa', state: 'Gujarat', subdomain: 'aravalli' },
  2640: { name: 'Dragon Palace Vipassana', city: 'Nagpur', state: 'Maharashtra', subdomain: 'dragon.in' },
  // Major centers that may have been missed - add as we discover them
  // These use location_XXXX format in dhamma.org API
};

// Get all location IDs as array
export function getAllLocationIds() {
  return Object.keys(INDIAN_CENTERS).map(id => `location_${id}`);
}

// Get location IDs as comma-separated string for API
export function getLocationIdsString() {
  return Object.keys(INDIAN_CENTERS).map(id => `location_${id}`).join(',');
}
