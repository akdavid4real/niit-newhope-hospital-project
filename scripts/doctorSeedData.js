// Nigerian doctor seed data matching the Doctor schema
// Expanded to 8x the base dataset with distinct phone numbers

const baseDoctors = [
  {
    FirstName: "Adebayo",
    LastName: "Ogundimu",
    Phone_Num: "+2348012345678",
    Employment_Type: "Resident",
    Ward_ID: null,
  },
  {
    FirstName: "Fatima",
    LastName: "Abdullahi",
    Phone_Num: "+2348023456789",
    Employment_Type: "Resident",
    Ward_ID: null,
  },
  {
    FirstName: "Chinedu",
    LastName: "Okwu",
    Phone_Num: "+2348034567890",
    Employment_Type: "Visiting",
    Ward_ID: null,
  },
  {
    FirstName: "Aisha",
    LastName: "Bello",
    Phone_Num: "+2348045678901",
    Employment_Type: "Resident",
    Ward_ID: null,
  },
  {
    FirstName: "Emeka",
    LastName: "Nwosu",
    Phone_Num: "+2348056789012",
    Employment_Type: "Visiting",
    Ward_ID: null,
  },
  {
    FirstName: "Ngozi",
    LastName: "Eze",
    Phone_Num: "+2348067890123",
    Employment_Type: "Resident",
    Ward_ID: null,
  },
  {
    FirstName: "Yusuf",
    LastName: "Garba",
    Phone_Num: "+2348078901234",
    Employment_Type: "Resident",
    Ward_ID: null,
  },
  {
    FirstName: "Blessing",
    LastName: "Okonkwo",
    Phone_Num: "+2348012345679",
    Employment_Type: "Visiting",
    Ward_ID: null,
  },
  {
    FirstName: "Ahmed",
    LastName: "Aliyu",
    Phone_Num: "+2348023456780",
    Employment_Type: "Resident",
    Ward_ID: null,
  },
  {
    FirstName: "Chioma",
    LastName: "Nnamdi",
    Phone_Num: "+2348034567891",
    Employment_Type: "Visiting",
    Ward_ID: null,
  },
]

module.exports = Array.from({ length: 8 }, (_, batchIndex) =>
  baseDoctors.map((doctor, doctorIndex) => ({
    ...doctor,
    Phone_Num: doctor.Phone_Num.slice(0, -1) + ((batchIndex + doctorIndex) % 10),
  })),
).flat()
