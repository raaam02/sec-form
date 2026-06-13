// Themes Configuration
export interface ThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  cardColor: string;
  fontFamily: string;
  borderRadius: string;
}

export const BUILTIN_THEMES: ThemeConfig[] = [
  {
    id: "minimal",
    name: "Minimal",
    primaryColor: "#0f172a", // slate-900
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    cardColor: "#f8fafc",
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.25rem"
  },
  {
    id: "modern-saas",
    name: "Modern SaaS",
    primaryColor: "#6366f1", // indigo-500
    backgroundColor: "#fafafa",
    textColor: "#18181b",
    cardColor: "#ffffff",
    fontFamily: "Outfit, sans-serif",
    borderRadius: "0.75rem"
  },
  {
    id: "dark",
    name: "Dark Mode",
    primaryColor: "#3b82f6", // blue-500
    backgroundColor: "#09090b", // zinc-950
    textColor: "#fafafa",
    cardColor: "#18181b", // zinc-900
    fontFamily: "Inter, sans-serif",
    borderRadius: "0.5rem"
  },
  {
    id: "corporate",
    name: "Corporate",
    primaryColor: "#0369a1", // sky-700
    backgroundColor: "#f0f4f8",
    textColor: "#1e293b",
    cardColor: "#ffffff",
    fontFamily: "Roboto, sans-serif",
    borderRadius: "0rem"
  },
  {
    id: "gradient",
    name: "Gradient",
    primaryColor: "#ec4899", // pink-500
    backgroundColor: "#f5f3ff", // violet-50
    textColor: "#1e1b4b",
    cardColor: "#ffffff",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    borderRadius: "1rem"
  }
];

// Pre-seeded templates
export interface FormFieldTemplate {
  id: string;
  type: "text" | "textarea" | "email" | "number" | "select" | "multiselect" | "checkbox" | "rating" | "date";
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  fields: FormFieldTemplate[];
  themeId: string;
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "customer-feedback",
    title: "Customer Feedback Form",
    description: "Gather feedback from your users to improve your product or service.",
    category: "Business",
    themeId: "modern-saas",
    fields: [
      {
        id: "cf_name",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your name",
        required: true
      },
      {
        id: "cf_email",
        type: "email",
        label: "Email Address",
        placeholder: "you@example.com",
        required: true
      },
      {
        id: "cf_rating",
        type: "rating",
        label: "Overall Satisfaction",
        description: "Rate your overall experience from 1 to 5 stars",
        required: true
      },
      {
        id: "cf_hear_about_us",
        type: "select",
        label: "How did you hear about us?",
        options: ["Search Engine", "Social Media", "Friend/Word of Mouth", "Advertisement", "Other"],
        required: false
      },
      {
        id: "cf_features",
        type: "multiselect",
        label: "Which features do you use the most?",
        options: ["Analytics", "Form Builder", "Integrations", "AI Insights", "Mobile App"],
        required: false
      },
      {
        id: "cf_feedback",
        type: "textarea",
        label: "Detailed Feedback",
        placeholder: "What can we do to improve?",
        required: true
      },
      {
        id: "cf_subscribe",
        type: "checkbox",
        label: "Subscribe to product updates and newsletters",
        required: false
      }
    ]
  },
  {
    id: "event-registration",
    title: "Event Registration",
    description: "Register attendees for your upcoming conference, webinar, or meetup.",
    category: "Events",
    themeId: "gradient",
    fields: [
      {
        id: "er_name",
        type: "text",
        label: "Attendee Name",
        required: true
      },
      {
        id: "er_email",
        type: "email",
        label: "Email",
        required: true
      },
      {
        id: "er_ticket_type",
        type: "select",
        label: "Ticket Type",
        options: ["General Admission ($0)", "VIP Pass ($99)", "Developer Ticket ($49)"],
        required: true
      },
      {
        id: "er_tshirt_size",
        type: "select",
        label: "T-Shirt Size",
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        required: false
      },
      {
        id: "er_dietary",
        type: "multiselect",
        label: "Dietary Restrictions",
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher"],
        required: false
      },
      {
        id: "er_date",
        type: "date",
        label: "Preferred Arrival Date",
        required: true
      }
    ]
  },
  {
    id: "job-application",
    title: "Job Application",
    description: "Accept candidate applications for open roles in your team.",
    category: "HR",
    themeId: "corporate",
    fields: [
      {
        id: "ja_name",
        type: "text",
        label: "Full Name",
        required: true
      },
      {
        id: "ja_email",
        type: "email",
        label: "Email",
        required: true
      },
      {
        id: "ja_phone",
        type: "text",
        label: "Phone Number",
        required: true
      },
      {
        id: "ja_portfolio",
        type: "text",
        label: "Portfolio or LinkedIn URL",
        placeholder: "https://...",
        required: false
      },
      {
        id: "ja_experience",
        type: "number",
        label: "Years of Professional Experience",
        required: true,
        validation: { min: 0 }
      },
      {
        id: "ja_role",
        type: "select",
        label: "Which role are you applying for?",
        options: ["Frontend Engineer", "Backend Engineer", "Product Manager", "UX Designer", "DevOps Engineer"],
        required: true
      },
      {
        id: "ja_cover_letter",
        type: "textarea",
        label: "Cover Letter",
        placeholder: "Tell us why you are a great fit...",
        required: false
      }
    ]
  },
  {
    id: "newsletter-signup",
    title: "Newsletter Signup",
    description: "Grow your audience with a simple email collection newsletter form.",
    category: "Marketing",
    themeId: "minimal",
    fields: [
      {
        id: "ns_email",
        type: "email",
        label: "Email Address",
        placeholder: "enter your email...",
        required: true
      },
      {
        id: "ns_interests",
        type: "multiselect",
        label: "Topics of Interest",
        options: ["Technology", "Business & Finance", "Design & UX", "AI & Machine Learning", "Marketing Tips"],
        required: false
      },
      {
        id: "ns_consent",
        type: "checkbox",
        label: "I agree to receive weekly marketing newsletters",
        required: true
      }
    ]
  },
  {
    id: "restaurant-survey",
    title: "Restaurant Feedback Form",
    description: "Help us serve you better! Tell us about your dining experience.",
    category: "Hospitality",
    themeId: "modern-saas",
    fields: [
      {
        id: "rs_date",
        type: "date",
        label: "Date of Visit",
        required: true
      },
      {
        id: "rs_food_rating",
        type: "rating",
        label: "Food Quality",
        description: "Rate the quality and taste of your meal",
        required: true
      },
      {
        id: "rs_service_rating",
        type: "rating",
        label: "Service Quality",
        description: "Rate the friendliness and speed of our staff",
        required: true
      },
      {
        id: "rs_order",
        type: "select",
        label: "Order Type",
        options: ["Dine-in", "Takeaway", "Home Delivery"],
        required: true
      },
      {
        id: "rs_cleanliness",
        type: "rating",
        label: "Ambiance and Cleanliness",
        required: false
      },
      {
        id: "rs_comments",
        type: "textarea",
        label: "Any additional comments or suggestions?",
        required: false
      }
    ]
  }
];
