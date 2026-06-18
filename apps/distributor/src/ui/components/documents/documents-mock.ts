export interface Document {
  title: string;
  file: string;
  status: 'approved' | 'rejected' | 'pending' | 'expiring';
  uploaded: string;
  expiry?: string;
  optional?: boolean;
  note?: string;

  type: string;
  reviewedBy?: string;
  approvedOn?: string;
  validUntil?: string;
  replacement?: string;

  activity: {
    title: string;
    description: string;
    date: string;
  }[];
}

export const documents: Document[] = [
  {
    title: "Director's Government ID (Driver's License)",
    file: 'driver_license.pdf',
    status: 'approved',
    uploaded: 'Feb 12, 2026',
    expiry: 'Dec 31, 2026',

    type: "Driver's License",
    reviewedBy: 'Chioma Okafor',
    approvedOn: 'Feb 13, 2026 • 11:36 AM',
    validUntil: 'Dec 31, 2026',

    activity: [
      {
        title: 'Document uploaded',
        description: 'driver_license.pdf',
        date: 'Feb 12, 2026',
      },
      {
        title: 'Validation passed',
        description: 'All checks completed.',
        date: 'Feb 13, 2026',
      },
      {
        title: 'Approved',
        description: 'Document has been approved.',
        date: 'Feb 13, 2026',
      },
    ],
  },

  {
    title: 'Tax Clearance Certificate',
    file: 'tin_doc.pdf',
    status: 'rejected',
    uploaded: 'Feb 12, 2026',
    expiry: 'Feb 12, 2027',

    type: 'Tax Certificate',
    note:
      'The TIN number on the document does not match the one provided during registration.',

    activity: [
      {
        title: 'Rejected',
        description: 'TIN number mismatch',
        date: 'Feb 13, 2026',
      },
    ],
  },

  {
    title: 'Utility Bill',
    file: 'utility_bill.pdf',
    status: 'expiring',
    uploaded: 'Feb 12, 2026',
    expiry: 'Apr 12, 2026',
    optional: true,

    type: 'Utility Bill',
    validUntil: 'Apr 12, 2026',
    replacement: 'None',

    activity: [
      {
        title: 'Expiry countdown',
        description: '18 days remaining',
        date: 'Today',
      },
    ],
  },
];