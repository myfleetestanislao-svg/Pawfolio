// Sample Pet Data
export const samplePets = [
  {
    id: "pet-1",
    name: "Max",
    species: "Dog",
    breed: "Golden Retriever",
    gender: "Neutered",
    birthDate: "2020-03-15",
    weight: 32,
    weightUnit: "kg",
    microchipNumber: "985141404567890",
    distinguishingMarks: "White patch on chest, scar on left ear",
    photo: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
    spayNeuterStatus: "Neutered",
    spayNeuterDate: "2020-09-20",
    spayNeuterClinic: "Happy Paws Veterinary Clinic",
    spayNeuterNotes: "Routine procedure, no complications",
    isIntact: false,
  },
  {
    id: "pet-2",
    name: "Luna",
    species: "Cat",
    breed: "Maine Coon",
    gender: "Spayed",
    birthDate: "2021-07-22",
    weight: 5.5,
    weightUnit: "kg",
    microchipNumber: "985141404567891",
    distinguishingMarks: "Tabby markings, extra fluffy tail",
    photo: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
    spayNeuterStatus: "Spayed",
    spayNeuterDate: "2022-01-15",
    spayNeuterClinic: "City Animal Hospital",
    spayNeuterNotes: "Smooth recovery",
    isIntact: false,
  },
  {
    id: "pet-3",
    name: "Charlie",
    species: "Bird",
    breed: "African Grey Parrot",
    gender: "Male",
    birthDate: "2019-05-10",
    weight: 0.45,
    weightUnit: "kg",
    microchipNumber: "985141404567892",
    distinguishingMarks: "Bright red tail feathers",
    photo: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop",
    isIntact: true,
  },
];

// Sample Vaccination Records
export const sampleVaccinations = [
  {
    id: "vac-1",
    petId: "pet-1",
    vaccineType: "Anti-Rabies",
    dateAdministered: "2024-01-15",
    expiryDate: "2025-01-15",
    lotNumber: "RAB2024-001",
    administeringVet: "Dr. Sarah Johnson",
    clinic: "Happy Paws Veterinary Clinic",
  },
  {
    id: "vac-2",
    petId: "pet-1",
    vaccineType: "DHPP",
    dateAdministered: "2024-02-20",
    expiryDate: "2025-02-20",
    lotNumber: "DHPP2024-045",
    administeringVet: "Dr. Sarah Johnson",
    clinic: "Happy Paws Veterinary Clinic",
  },
  {
    id: "vac-3",
    petId: "pet-2",
    vaccineType: "FVRCP",
    dateAdministered: "2024-03-10",
    expiryDate: "2025-03-10",
    lotNumber: "FVR2024-112",
    administeringVet: "Dr. Michael Chen",
    clinic: "City Animal Hospital",
  },
  {
    id: "vac-4",
    petId: "pet-2",
    vaccineType: "Anti-Rabies",
    dateAdministered: "2024-03-10",
    expiryDate: "2025-03-10",
    lotNumber: "RAB2024-089",
    administeringVet: "Dr. Michael Chen",
    clinic: "City Animal Hospital",
  },
];

// Sample Medical History
export const sampleMedicalHistory = [
  {
    id: "med-1",
    petId: "pet-1",
    type: "condition",
    condition: "Hip Dysplasia",
    dateOfDiagnosis: "2023-06-15",
    notes: "Mild case, managed with supplements and weight control",
    clinic: "Happy Paws Veterinary Clinic",
  },
  {
    id: "med-2",
    petId: "pet-1",
    type: "surgery",
    surgeryName: "Dental Cleaning",
    dateOfSurgery: "2024-04-10",
    clinic: "Happy Paws Veterinary Clinic",
    notes: "Routine cleaning, 2 teeth extracted due to decay",
    postOpCare: "Soft food for 5 days, antibiotics for 7 days",
  },
  {
    id: "med-3",
    petId: "pet-2",
    type: "condition",
    condition: "Upper Respiratory Infection",
    dateOfDiagnosis: "2023-11-20",
    notes: "Treated with antibiotics, full recovery in 10 days",
    clinic: "City Animal Hospital",
  },
];

// Sample Allergies
export const sampleAllergies = [
  {
    id: "allergy-1",
    petId: "pet-1",
    allergyType: "Food",
    allergen: "Chicken",
    severityLevel: "Moderate",
    commonSymptoms: "Itchy skin, ear infections, digestive upset",
    emergencyResponse: "Switch to hypoallergenic food, give Benadryl if symptoms are severe",
    medication: "Apoquel 16mg",
    lastReactionDate: "2024-02-15",
  },
  {
    id: "allergy-2",
    petId: "pet-1",
    allergyType: "Environmental",
    allergen: "Grass Pollen",
    severityLevel: "Low",
    commonSymptoms: "Watery eyes, sneezing, itchy paws",
    emergencyResponse: "Wipe paws after walks, antihistamines as needed",
    medication: "Zyrtec",
    lastReactionDate: "2024-05-01",
  },
  {
    id: "allergy-3",
    petId: "pet-2",
    allergyType: "Medication",
    allergen: "Penicillin",
    severityLevel: "High",
    commonSymptoms: "Swelling, difficulty breathing, hives",
    emergencyResponse: "EMERGENCY: Go to vet immediately. Do not administer any penicillin-based antibiotics",
    medication: "EpiPen (if prescribed)",
    lastReactionDate: "2023-08-10",
  },
];

// Sample Medications
export const sampleMedications = [
  {
    id: "med-rx-1",
    petId: "pet-1",
    medicationName: "Apoquel",
    dosage: "16mg",
    frequency: "Once a day",
    purpose: "Allergy management - reduces itching",
    ongoing: true,
    startDate: "2024-01-01",
  },
  {
    id: "med-rx-2",
    petId: "pet-1",
    medicationName: "Cosequin",
    dosage: "1 chewable tablet",
    frequency: "Once a day",
    purpose: "Joint health supplement for hip dysplasia",
    ongoing: true,
    startDate: "2023-07-01",
  },
  {
    id: "med-rx-3",
    petId: "pet-2",
    medicationName: "Feliway Diffuser",
    dosage: "Continuous",
    frequency: "Replace monthly",
    purpose: "Anxiety reduction",
    ongoing: true,
    startDate: "2024-02-01",
  },
];

// Sample Diet Requirements
export const sampleDietaryRequirements = [
  {
    id: "diet-1",
    petId: "pet-1",
    specialDietType: "Grain-free",
    forbiddenFoods: "Chicken, corn, wheat, soy, chocolate, grapes, onions",
    feedingSchedule: "2 cups at 7 AM, 2 cups at 6 PM",
    supplements: "Fish oil (1 pump), Probiotic powder (1 scoop)",
    notes: "Use salmon or lamb-based food only",
  },
  {
    id: "diet-2",
    petId: "pet-2",
    specialDietType: "Prescription Diet",
    forbiddenFoods: "Dairy, raw fish, chocolate, onions, garlic",
    feedingSchedule: "1/2 cup at 8 AM, 1/2 cup at 7 PM",
    supplements: "Lysine powder for immune support",
    notes: "Hill's Science Diet c/d for urinary health",
  },
  {
    id: "diet-3",
    petId: "pet-3",
    specialDietType: "Standard",
    forbiddenFoods: "Avocado, chocolate, caffeine, alcohol",
    feedingSchedule: "Fresh pellets daily, fruits/veggies twice daily",
    supplements: "Calcium supplement twice weekly",
    notes: "Loves almonds and sunflower seeds as treats",
  },
];

// Sample Reminders
export const sampleReminders = [
  {
    id: "reminder-1",
    petId: "pet-1",
    type: "vaccination",
    title: "Anti-Rabies Vaccination Due",
    description: "Max's rabies vaccination expires soon",
    dueDate: "2025-01-15",
    status: "pending",
    priority: "high",
  },
  {
    id: "reminder-2",
    petId: "pet-1",
    type: "medication",
    title: "Refill Apoquel",
    description: "Monthly medication refill needed",
    dueDate: "2024-12-20",
    status: "pending",
    priority: "medium",
  },
  {
    id: "reminder-3",
    petId: "pet-2",
    type: "checkup",
    title: "Annual Wellness Exam",
    description: "Luna's yearly checkup with Dr. Chen",
    dueDate: "2025-01-22",
    status: "pending",
    priority: "medium",
  },
  {
    id: "reminder-4",
    petId: "pet-1",
    type: "grooming",
    title: "Grooming Appointment",
    description: "Scheduled bath and nail trim at PetSmart",
    dueDate: "2024-12-15",
    status: "completed",
    priority: "low",
  },
];

// Sample Share Links
export const sampleShareLinks = [
  {
    id: "share-1",
    petId: "pet-1",
    token: "abc123def456",
    createdAt: "2024-11-01",
    expiresAt: "2024-12-01",
    accessType: "full",
    accessCount: 5,
    isActive: true,
    recipientName: "Happy Paws Vet Clinic",
    recipientEmail: "records@happypaws.com",
  },
  {
    id: "share-2",
    petId: "pet-1",
    token: "xyz789ghi012",
    createdAt: "2024-11-15",
    expiresAt: "2024-11-22",
    accessType: "emergency",
    accessCount: 2,
    isActive: true,
    recipientName: "Pet Sitter - Jane",
    recipientEmail: "jane.sitter@email.com",
  },
  {
    id: "share-3",
    petId: "pet-2",
    token: "mno345pqr678",
    createdAt: "2024-10-01",
    expiresAt: "2024-10-15",
    accessType: "full",
    accessCount: 3,
    isActive: false,
    recipientName: "City Animal Hospital",
    recipientEmail: "info@cityanimal.com",
  },
];

// Sample User Data
export const sampleUser = {
  id: "user-1",
  fullName: "Alex Thompson",
  email: "alex.thompson@email.com",
  profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  primaryPhone: "+1 (555) 123-4567",
  secondaryPhone: "+1 (555) 987-6543",
  homeAddress: "123 Pet Lover Lane, San Francisco, CA 94102",
  preferredEmergencyVet: "24/7 Emergency Pet Hospital - (555) 911-PETS",
  emergencyContactPerson: "Sarah Thompson (Sister)",
  emergencyContactNumber: "+1 (555) 456-7890",
  medicalReleaseAuthorization: true,
};

// Helper function to calculate age from birthdate
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  
  return `${years} year${years !== 1 ? 's' : ''}${months > 0 ? `, ${months} month${months !== 1 ? 's' : ''}` : ''}`;
}

// Helper function to format date
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Helper function to check if date is upcoming (within 30 days)
export function isUpcoming(dateString, days = 30) {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 && diffDays <= days;
}

// Helper function to check if date is overdue
export function isOverdue(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  return date < today;
}
