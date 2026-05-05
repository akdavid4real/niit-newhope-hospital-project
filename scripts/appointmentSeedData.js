// Public appointment request seed data for visitor booking flow

const baseAppointments = [
  {
    FirstName: "Amara",
    LastName: "Okeke",
    Phone_Num: "+2348012001101",
    Email: "amara.okeke@example.com",
    Age: 29,
    Gender: "Female",
    Preferred_Date: "2026-05-06",
    Reason_For_Visit: "Recurring chest discomfort and shortness of breath during activity",
    Notes: "Prefers a morning follow-up if available",
    Status: "Pending",
  },
  {
    FirstName: "Musa",
    LastName: "Bello",
    Phone_Num: "+2348012001102",
    Email: "musa.bello@example.com",
    Age: 41,
    Gender: "Male",
    Preferred_Date: "2026-05-07",
    Reason_For_Visit: "Persistent ulcer symptoms and abdominal pain",
    Notes: "",
    Status: "Confirmed",
  },
  {
    FirstName: "Kemi",
    LastName: "Afolayan",
    Phone_Num: "+2348012001103",
    Email: "",
    Age: 34,
    Gender: "Female",
    Preferred_Date: "2026-05-08",
    Reason_For_Visit: "Prenatal consultation and routine maternal check",
    Notes: "Requested a female clinician if possible",
    Status: "Completed",
  },
  {
    FirstName: "Chuka",
    LastName: "Nwosu",
    Phone_Num: "+2348012001104",
    Email: "chuka.nwosu@example.com",
    Age: 37,
    Gender: "Male",
    Preferred_Date: "2026-05-09",
    Reason_For_Visit: "Knee pain after a football injury",
    Notes: "",
    Status: "Cancelled",
  },
  {
    FirstName: "Zainab",
    LastName: "Sani",
    Phone_Num: "+2348012001105",
    Email: "zainab.sani@example.com",
    Age: 25,
    Gender: "Female",
    Preferred_Date: "2026-05-10",
    Reason_For_Visit: "Follow-up for frequent migraine episodes",
    Notes: "Can also attend in the afternoon",
    Status: "Pending",
  },
  {
    FirstName: "Ifeanyi",
    LastName: "Ndukwe",
    Phone_Num: "+2348012001106",
    Email: "",
    Age: 46,
    Gender: "Male",
    Preferred_Date: "2026-05-11",
    Reason_For_Visit: "Blood sugar review and medication refill",
    Notes: "",
    Status: "Confirmed",
  },
]

module.exports = Array.from({ length: 8 }, (_, batchIndex) =>
  baseAppointments.map((appointment, appointmentIndex) => {
    const day = String(6 + batchIndex + appointmentIndex).padStart(2, "0")
    const statusCycle = ["Pending", "Confirmed", "Completed", "Cancelled"]
    const status = statusCycle[(batchIndex + appointmentIndex) % statusCycle.length]

    return {
      ...appointment,
      Phone_Num: appointment.Phone_Num.slice(0, -1) + ((batchIndex + appointmentIndex) % 10),
      Email: appointment.Email
        ? appointment.Email.replace("@", `+${batchIndex + 1}${appointmentIndex + 1}@`)
        : "",
      Preferred_Date: `2026-05-${day}`,
      Notes: appointment.Notes || (appointmentIndex % 2 === 0 ? "Requested callback before visit" : ""),
      Status: status,
      AssignedDoctorOffset: status === "Pending" ? null : appointmentIndex,
      AssignedWardOffset: status === "Pending" ? null : appointmentIndex,
    }
  }),
).flat()
