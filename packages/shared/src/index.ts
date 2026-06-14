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
  // --- Category: Feedback & Surveys (4 Forms) ---
  {
    id: "customer-feedback",
    title: "Customer Feedback Form",
    description: "Gather feedback from your users to improve your product or service.",
    category: "Feedback & Surveys",
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
    id: "restaurant-survey",
    title: "Restaurant Feedback Form",
    description: "Help us serve you better! Tell us about your dining experience.",
    category: "Feedback & Surveys",
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
  },
  {
    id: "product-satisfaction",
    title: "Product Satisfaction Survey",
    description: "Gather deep usage metrics, Net Promoter Score (NPS), and feature suggestions for your SaaS application.",
    category: "Feedback & Surveys",
    themeId: "modern-saas",
    fields: [
      {
        id: "ps_nps",
        type: "rating",
        label: "Likelihood to Recommend (NPS)",
        description: "On a scale of 1 to 5, how likely are you to recommend our product to a colleague?",
        required: true
      },
      {
        id: "ps_frequency",
        type: "select",
        label: "How often do you use our product?",
        options: ["Daily", "Weekly", "Monthly", "Rarely"],
        required: true
      },
      {
        id: "ps_valuable_features",
        type: "multiselect",
        label: "Which features do you find most valuable?",
        options: ["Dashboard Analytics", "Form Builder Canvas", "Gemini AI Insights", "Theme Styling", "API Integrations"],
        required: false
      },
      {
        id: "ps_improvements",
        type: "textarea",
        label: "What features or improvements would you like to see next?",
        placeholder: "Describe what you would love to have...",
        required: false
      }
    ]
  },
  {
    id: "course-evaluation",
    title: "Course & Instructor Evaluation",
    description: "Collect student feedback regarding course content clarity, material utility, and instructor performance.",
    category: "Feedback & Surveys",
    themeId: "minimal",
    fields: [
      {
        id: "ce_instructor_rating",
        type: "rating",
        label: "Instructor Performance",
        description: "Rate the instructor's communication, presentation, and responsiveness.",
        required: true
      },
      {
        id: "ce_content_rating",
        type: "rating",
        label: "Course Content Quality",
        description: "Rate the relevance and depth of the materials presented.",
        required: true
      },
      {
        id: "ce_materials",
        type: "multiselect",
        label: "Which materials did you find most useful?",
        options: ["Lecture Slides", "Hands-on Code Labs", "Video Recording Archive", "Textbook Readings", "Guest Speaker Q&A"],
        required: false
      },
      {
        id: "ce_comments",
        type: "textarea",
        label: "General Comments or Suggestions",
        placeholder: "Tell us how we can make the course better...",
        required: false
      }
    ]
  },

  // --- Category: Marketing & Sales (4 Forms) ---
  {
    id: "newsletter-signup",
    title: "Newsletter Signup",
    description: "Grow your audience with a simple email collection newsletter form.",
    category: "Marketing & Sales",
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
    id: "contact-lead",
    title: "Contact & Lead Capture",
    description: "A clean, high-converting minimal form to capture contact details and user inquiries.",
    category: "Marketing & Sales",
    themeId: "gradient",
    fields: [
      {
        id: "cl_name",
        type: "text",
        label: "Full Name",
        placeholder: "Jane Doe",
        required: true
      },
      {
        id: "cl_email",
        type: "email",
        label: "Email Address",
        placeholder: "jane@example.com",
        required: true
      },
      {
        id: "cl_subject",
        type: "text",
        label: "Subject",
        placeholder: "How can we help you?",
        required: true
      },
      {
        id: "cl_message",
        type: "textarea",
        label: "Message",
        placeholder: "Enter your message details here...",
        required: true
      }
    ]
  },
  {
    id: "sales-qualification",
    title: "Sales Lead Qualification",
    description: "Qualify B2B sales leads based on company size, budget ranges, and project urgency.",
    category: "Marketing & Sales",
    themeId: "corporate",
    fields: [
      {
        id: "sq_company",
        type: "text",
        label: "Company Name",
        placeholder: "Acme Corp",
        required: true
      },
      {
        id: "sq_size",
        type: "select",
        label: "Company Size",
        options: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"],
        required: true
      },
      {
        id: "sq_budget",
        type: "select",
        label: "Annual Budget",
        options: ["Under $5,000", "$5,000 - $20,000", "$20,000 - $50,000", "$50,000 - $100,000", "$100,000+"],
        required: true
      },
      {
        id: "sq_urgency",
        type: "select",
        label: "Expected Timeline",
        options: ["Immediate (within 1 month)", "Soon (1-3 months)", "Planning (3-6 months)", "Flexible"],
        required: true
      },
      {
        id: "sq_notes",
        type: "textarea",
        label: "Additional Project Requirements",
        placeholder: "Tell us more about your target outcomes...",
        required: false
      }
    ]
  },
  {
    id: "demo-request",
    title: "B2B Product Demo Request",
    description: "Request a custom product walkthrough and consult with a sales engineer.",
    category: "Marketing & Sales",
    themeId: "modern-saas",
    fields: [
      {
        id: "dr_company",
        type: "text",
        label: "Company Name",
        placeholder: "Enter your organization's name",
        required: true
      },
      {
        id: "dr_size",
        type: "select",
        label: "Company Size",
        options: ["1-10 employees", "11-50 employees", "51-200 employees", "201-500 employees", "500+ employees"],
        required: true
      },
      {
        id: "dr_phone",
        type: "text",
        label: "Phone Number",
        placeholder: "+1 (555) 000-0000",
        required: true
      },
      {
        id: "dr_role",
        type: "text",
        label: "Job Title",
        placeholder: "e.g. Director of Operations",
        required: true
      },
      {
        id: "dr_notes",
        type: "textarea",
        label: "Demo Objectives",
        placeholder: "Tell us what workflows you are trying to optimize...",
        required: false
      }
    ]
  },

  // --- Category: Operations & HR (4 Forms) ---
  {
    id: "event-registration",
    title: "Event Registration",
    description: "Register attendees for your upcoming conference, webinar, or meetup.",
    category: "Operations & HR",
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
    category: "Operations & HR",
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
    id: "bug-report",
    title: "Bug & Issue Report Form",
    description: "Log platform bugs, defects, and browser compatibility issues.",
    category: "Operations & HR",
    themeId: "corporate",
    fields: [
      {
        id: "br_title",
        type: "text",
        label: "Issue Summary",
        placeholder: "Briefly describe the bug",
        required: true
      },
      {
        id: "br_severity",
        type: "select",
        label: "Severity Level",
        options: ["Low", "Medium", "High", "Critical"],
        required: true
      },
      {
        id: "br_steps",
        type: "textarea",
        label: "Steps to Reproduce",
        placeholder: "1. Navigate to...\n2. Click...",
        required: true
      },
      {
        id: "br_device",
        type: "text",
        label: "Browser & OS",
        placeholder: "e.g. Chrome 125 on Windows 11",
        required: false
      }
    ]
  },
  {
    id: "it-support",
    title: "IT Support Request",
    description: "Submit hardware, network, or application access assistance requests.",
    category: "Operations & HR",
    themeId: "minimal",
    fields: [
      {
        id: "is_category",
        type: "select",
        label: "Issue Category",
        options: ["Hardware", "Software", "Access/Account", "Network", "Other"],
        required: true
      },
      {
        id: "is_priority",
        type: "select",
        label: "Priority Level",
        options: ["Low", "Medium", "High"],
        required: true
      },
      {
        id: "is_description",
        type: "textarea",
        label: "Detailed Description",
        placeholder: "Please describe the problem you are experiencing",
        required: true
      },
      {
        id: "is_office_location",
        type: "text",
        label: "Office Location / Desk #",
        placeholder: "e.g. NYC - Floor 4 - Desk 412",
        required: false
      }
    ]
  }
];
