// Nigerian medical history seed data for discharged and active patient records

const diseaseTemplates = [
  { Disease: "Hypertension", Treatment: "Blood pressure monitoring and medication review" },
  { Disease: "Malaria", Treatment: "Antimalarial therapy and hydration support" },
  { Disease: "Appendicitis", Treatment: "Surgical review and post-operative monitoring" },
  { Disease: "Diabetes Type 2", Treatment: "Glucose control plan and dietary counselling" },
  { Disease: "Pneumonia", Treatment: "Antibiotics, oxygen assessment, and chest monitoring" },
  { Disease: "Gastroenteritis", Treatment: "Rehydration therapy and symptom management" },
  { Disease: "Asthma", Treatment: "Nebulization, inhaler review, and trigger management" },
  { Disease: "Typhoid Fever", Treatment: "Antibiotics and fever management plan" },
]

module.exports = Array.from({ length: 48 }, (_, index) => {
  const template = diseaseTemplates[index % diseaseTemplates.length]

  return {
    ...template,
    DischargeWardOffset: index % 3 === 0 ? 1 : null,
  }
})
