import { create } from "zustand";
import {
  samplePets,
  sampleVaccinations,
  sampleMedicalHistory,
  sampleAllergies,
  sampleMedications,
  sampleDietaryRequirements,
  sampleReminders,
  sampleShareLinks,
  sampleUser,
} from "./sample-data";

export const useStore = create((set, get) => ({
  // Auth state
  isAuthenticated: false,
  user: null,
  
  // Data
  pets: samplePets,
  vaccinations: sampleVaccinations,
  medicalHistory: sampleMedicalHistory,
  allergies: sampleAllergies,
  medications: sampleMedications,
  dietaryRequirements: sampleDietaryRequirements,
  reminders: sampleReminders,
  shareLinks: sampleShareLinks,
  
  // Selected pet
  selectedPetId: samplePets[0]?.id || null,
  
  // Auth actions
  login: (email, password) => {
    // Simulate login - accept any credentials for demo
    set({ 
      isAuthenticated: true, 
      user: sampleUser 
    });
    return true;
  },
  
  signup: (name, email, password) => {
    // Simulate signup
    set({ 
      isAuthenticated: true, 
      user: { ...sampleUser, fullName: name, email } 
    });
    return true;
  },
  
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
  
  // Pet actions
  addPet: (pet) => {
    const newPet = {
      ...pet,
      id: `pet-${Date.now()}`,
      isIntact: pet.gender === "Male" || pet.gender === "Female",
    };

    set((state) => ({
      pets: [...state.pets, newPet],
      selectedPetId: newPet.id,
    }));
  },

  setSelectedPet: (petId) => set({ selectedPetId: petId }),
  
  getSelectedPet: () => {
    const state = get();
    return state.pets.find((p) => p.id === state.selectedPetId);
  },
  
  getPetById: (id) => {
    return get().pets.find((p) => p.id === id);
  },
  
  // Get records for a specific pet
  getPetVaccinations: (petId) => {
    return get().vaccinations.filter((v) => v.petId === petId);
  },
  
  getPetMedicalHistory: (petId) => {
    return get().medicalHistory.filter((m) => m.petId === petId);
  },
  
  getPetAllergies: (petId) => {
    return get().allergies.filter((a) => a.petId === petId);
  },
  
  getPetMedications: (petId) => {
    return get().medications.filter((m) => m.petId === petId);
  },
  
  getPetDiet: (petId) => {
    return get().dietaryRequirements.find((d) => d.petId === petId);
  },
  
  getPetReminders: (petId) => {
    return get().reminders.filter((r) => r.petId === petId);
  },
  
  getPetShareLinks: (petId) => {
    return get().shareLinks.filter((s) => s.petId === petId);
  },
  
  // Reminder actions
  addReminder: (reminder) => {
    set((state) => ({
      reminders: [...state.reminders, { ...reminder, status: "pending" }],
    }));
  },

  completeReminder: (reminderId) => {
    set((state) => ({
      reminders: state.reminders.map((r) =>
        r.id === reminderId ? { ...r, status: "completed" } : r
      ),
    }));
  },
  
  // Share link actions
  createShareLink: (petId, accessType, expiresAt, recipientName, recipientEmail) => {
    const newLink = {
      id: `share-${Date.now()}`,
      petId,
      token: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString().split("T")[0],
      expiresAt,
      accessType,
      accessCount: 0,
      isActive: true,
      recipientName,
      recipientEmail,
    };
    set((state) => ({
      shareLinks: [...state.shareLinks, newLink],
    }));
    return newLink;
  },
  
  revokeShareLink: (linkId) => {
    set((state) => ({
      shareLinks: state.shareLinks.map((s) =>
        s.id === linkId ? { ...s, isActive: false } : s
      ),
    }));
  },
  
  // Get all timeline events for a pet
  getPetTimeline: (petId) => {
    const state = get();
    const events = [];
    
    // Add vaccinations
    state.vaccinations
      .filter((v) => v.petId === petId)
      .forEach((v) => {
        events.push({
          id: v.id,
          type: "vaccination",
          title: v.vaccineType,
          date: v.dateAdministered,
          description: `Administered by ${v.administeringVet} at ${v.clinic}`,
          icon: "Syringe",
        });
      });
    
    // Add medical history
    state.medicalHistory
      .filter((m) => m.petId === petId)
      .forEach((m) => {
        if (m.type === "condition") {
          events.push({
            id: m.id,
            type: "condition",
            title: m.condition,
            date: m.dateOfDiagnosis,
            description: m.notes,
            icon: "Stethoscope",
          });
        } else if (m.type === "surgery") {
          events.push({
            id: m.id,
            type: "surgery",
            title: m.surgeryName,
            date: m.dateOfSurgery,
            description: `${m.notes} - Post-op: ${m.postOpCare}`,
            icon: "Scissors",
          });
        }
      });
    
    // Sort by date descending
    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
}));
