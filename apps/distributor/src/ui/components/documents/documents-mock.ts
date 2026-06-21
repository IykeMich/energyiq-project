export interface Document {
  title: string;
  file: string;
  status: 'approved' | 'rejected' | 'pending' | 'expiring';
  uploaded: string;
  expiry?: string;
  optional?: boolean;
  note?: string;

  type: string;

  activity: {
    title: string;
    description: string;
    date: string;
  }[];
}



export const documents: Document[] = [
  {
    title: 'National ID / Passport',
    file: 'passport_john_doe.pdf',
    status: 'approved',
    uploaded: 'Feb 12, 2026',
    expiry: 'Feb 12, 2027',

    type: 'Passport',

    activity: [],
  },

  {
    title: "Director's Government ID (Driver's License)",
    file: 'driver_license.pdf',
    status: 'approved',
    uploaded: 'Feb 12, 2026',
    expiry: 'Feb 12, 2027',

    type: "Driver's License",

    activity: [],
  },

  {
    title: 'Certificate of Incorporation',
    file: 'cert_incorporation.pdf',
    status: 'approved',
    uploaded: 'Feb 12, 2026',
    expiry: 'Feb 13, 2027',

    type: 'Certificate',

    activity: [],
  },

  {
    title: 'Tax Clearance Certificate',
    file: 'tin_doc.pdf',
    status: 'rejected',
    uploaded: 'Feb 12, 2026',
    expiry: 'Feb 13, 2027',

    note:
      'The TIN number on the document does not match the one provided during registration.',

    type: 'Tax Certificate',

    activity: [],
  },

  {
    title: 'Utility Bill',
    file: 'business_license_2025.pdf',
    status: 'expiring',
    uploaded: 'Feb 12, 2026',
    expiry: 'May 12, 2026',
    optional: true,

    type: 'Utility Bill',

    activity: [],
  },

  {
    title: 'Shareholder Register',
    file: 'shareholder_register.pdf',
    status: 'pending',
    uploaded: 'Feb 12, 2026',

    optional: true,

    type: 'Register',

    activity: [],
  },
];