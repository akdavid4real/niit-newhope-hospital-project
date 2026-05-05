// Nigerian hospital ward seed data matching the Ward schema
// Expanded to 8x the base dataset with repeated but distinct wards

const baseWards = [
  {
    WardName: "ICU",
    TotalBeds: 20,
    AvailableBeds: 5,
    WardType: "Intensive Care",
  },
  {
    WardName: "General_Ward",
    TotalBeds: 50,
    AvailableBeds: 15,
    WardType: "General Medicine",
  },
  {
    WardName: "Emergency",
    TotalBeds: 15,
    AvailableBeds: 8,
    WardType: "Emergency Care",
  },
  {
    WardName: "OPD",
    TotalBeds: 10,
    AvailableBeds: 10,
    WardType: "Outpatient Department",
  },
  {
    WardName: "CCU",
    TotalBeds: 12,
    AvailableBeds: 6,
    WardType: "Cardiology",
  },
  {
    WardName: "Spl_Ward",
    TotalBeds: 30,
    AvailableBeds: 18,
    WardType: "Specialist Care",
  },
]

module.exports = Array.from({ length: 8 }, (_, batchIndex) =>
  baseWards.map((ward, wardIndex) => ({
    ...ward,
    WardType: `${ward.WardType} ${batchIndex + 1}`,
    TotalBeds: ward.TotalBeds + batchIndex * 2 + wardIndex,
    AvailableBeds: Math.min(ward.TotalBeds + batchIndex * 2 + wardIndex, ward.AvailableBeds + batchIndex),
  })),
).flat()
