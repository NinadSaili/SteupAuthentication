export const nodeRegistry = {
  form: {
    type: 'form',
    label: 'Form',
    category: 'Form',
    description: 'Collect user input and display HTML content.',
    requiredFields: ['type', 'id', 'fields'],
    optionalFields: [
      'name',
      'header',
      'footer',
      'on_next_button_label',
      'on_back_button_label',
      'on_next',
      'on_back',
      'on_success',
      'on_fail',
      'on_error',
      'is_terminal_node',
      'return_summary',
      'check_resolution',
      'min_resolution_height',
      'min_resolution_width'
    ],
    outputs: ['on_next', 'on_back', 'on_success', 'on_fail', 'on_error', 'on_check_resolution_fail']
  },
  js: {
    type: 'js',
    label: 'JS',
    category: 'JS',
    description: 'Execute JavaScript logic (non-UI).',
    requiredFields: ['type', 'id', 'config.js_code', 'on_success'],
    optionalFields: ['on_fail', 'on_error', 'name'],
    outputs: ['on_success', 'on_fail', 'on_error']
  },
  selfie_capture: {
    type: 'selfie_capture',
    label: 'Selfie Capture',
    category: 'Capture',
    description: 'Capture a selfie using the camera component.',
    requiredFields: ['type', 'id', 'on_success', 'on_fail'],
    optionalFields: [
      'check_resolution',
      'min_resolution_height',
      'min_resolution_width',
      'header',
      'footer',
      'on_check_resolution_fail',
      'on_error'
    ],
    outputs: ['on_success', 'on_fail', 'on_check_resolution_fail', 'on_error']
  },
  liveid_capture: {
    type: 'liveid_capture',
    label: 'LiveID Capture',
    category: 'Capture',
    description: 'Perform liveness detection and selfie capture.',
    requiredFields: ['type', 'id', 'render_style', 'on_success', 'on_fail', 'authtype', 'purpose', 'scopes'],
    optionalFields: [
      'check_resolution',
      'min_resolution_height',
      'min_resolution_width',
      'header',
      'footer',
      'on_check_resolution_fail',
      'on_error'
    ],
    outputs: ['on_success', 'on_fail', 'on_check_resolution_fail', 'on_error']
  },
  photo_id_capture: {
    type: 'photo_id_capture',
    label: 'Photo ID Capture',
    category: 'Capture',
    description: 'Capture a government-issued photo ID.',
    requiredFields: ['type', 'id', 'render_style', 'on_success', 'on_fail'],
    optionalFields: ['check_resolution', 'min_resolution_height', 'min_resolution_width', 'on_check_resolution_fail', 'on_error'],
    outputs: ['on_success', 'on_fail', 'on_check_resolution_fail', 'on_error']
  },
  ssn_capture: {
    type: 'ssn_capture',
    label: 'SSN Capture',
    category: 'Capture',
    description: 'Collect SSN input and proceed.',
    requiredFields: ['type', 'id', 'fields', 'on_success', 'on_fail', 'on_next_button_label'],
    optionalFields: ['on_error'],
    outputs: ['on_success', 'on_fail', 'on_error']
  },
  qr_for_device_handoff: {
    type: 'qr_for_device_handoff',
    label: 'QR Device Handoff',
    category: 'QR',
    description: 'Display QR code to continue on a different device.',
    requiredFields: ['type', 'id', 'fields'],
    optionalFields: ['on_error'],
    outputs: ['on_error']
  }
};

export const nodeCategories = Object.values(nodeRegistry).reduce((acc, node) => {
  if (!acc[node.category]) acc[node.category] = [];
  acc[node.category].push(node);
  return acc;
}, {});

export const formFieldTypes = [
  { value: 'html', label: 'HTML' },
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'ssn', label: 'SSN' }
];

export const defaultNodeData = {
  form: {
    fields: [
      { type: 'html', html: '' }
    ],
    on_next_button_label: 'Continue'
  },
  js: {
    config: { js_code: '' }
  },
  selfie_capture: {
    check_resolution: true,
    min_resolution_height: 1080,
    min_resolution_width: 1920
  },
  liveid_capture: {
    render_style: 'iframe',
    authtype: 'none',
    purpose: 'enroll',
    scopes: 'wallet,selfie,liveness_score,face_compare_score',
    check_resolution: true,
    min_resolution_height: 1080,
    min_resolution_width: 1920
  },
  photo_id_capture: {
    render_style: 'full_frame',
    check_resolution: true,
    min_resolution_height: 1080,
    min_resolution_width: 1920
  },
  ssn_capture: {
    fields: [
      {
        type: 'ssn',
        label: 'Social security number',
        required: true,
        placeholder: '###-##-####',
        name: 'ssn',
        tooltip: 'Why we ask for SSN...',
        replaceWithInHtml: '{form-ssn-element}'
      }
    ],
    on_next_button_label: 'Continue'
  },
  qr_for_device_handoff: {
    fields: [
      { type: 'html', html: '{placeholder_for_qrcode}' }
    ]
  }
};

export const navigationLabels = {
  on_next: 'Next',
  on_back: 'Back',
  on_success: 'Success',
  on_fail: 'Fail',
  on_error: 'Error',
  on_check_resolution_fail: 'Resolution Fail'
};
