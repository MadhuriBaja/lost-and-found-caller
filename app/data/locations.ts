export type Location = {
  id: string;
  name: string;
  city: string;
  phone: string;
  contactType: string;
  description: string;
  liveCallingEnabled: boolean;
};

export const locations: Location[] = [
  {
    id: "forum-sujana",
    name: "Forum Sujana Mall",
    city: "Hyderabad",
    phone: "",
    contactType: "Customer Care / Security",
    description:
      "Controlled hackathon test contact representing mall customer care/security",
    liveCallingEnabled: true,
  },
  {
    id: "inorbit-mall",
    name: "Inorbit Mall",
    city: "Hyderabad",
    phone: "",
    contactType: "Customer Care / Security",
    description:
      "Shopping mall with customer care and security services",
    liveCallingEnabled: false,
  },
  {
    id: "shilparamam",
    name: "Shilparamam",
    city: "Hyderabad",
    phone: "",
    contactType: "Visitor Assistance",
    description:
      "Arts and crafts village with visitor assistance",
    liveCallingEnabled: false,
  },
  {
    id: "rgia",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    phone: "",
    contactType: "Airport Lost & Found",
    description:
      "Airport with dedicated lost-and-found assistance",
    liveCallingEnabled: false,
  },
];