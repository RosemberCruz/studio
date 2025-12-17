
import type { LucideIcon } from 'lucide-react';
import { Building, Briefcase, Car, GraduationCap, Home, FileText, HeartPulse, ShieldCheck } from 'lucide-react';

export type ServiceCategory = {
  id: string;
  name: string;
  icon: LucideIcon;
  services: Service[];
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  description: string;
  cost: number;
  deliveryTime?: string;
  steps: Step[];
  documents: Document[];
};

export type Step = {
  id: string;
  title: string;
  content: string;
};

export type Document = {
  id: string;
  name: string;
  description: string;
};

export type ProgressItem = {
    id: string;
    serviceName: string;
    status: 'Completado' | 'En Proceso' | 'Iniciado' | 'Rechazado';
    currentStep: number;
    totalSteps: number;
    submittedDate: string;
    lastUpdate: string;
}

export const servicesData: ServiceCategory[] = [
  {
    id: 'tramites-fiscales',
    name: 'Trámites Fiscales (RFC)',
    icon: FileText,
    services: [
      {
        id: 'rfc-original',
        slug: 'rfc-original',
        name: 'Constancia de Situación Fiscal Original',
        description: 'Obtén tu CSF en tiempo y forma de manera original.',
        cost: 100,
        deliveryTime: "1 a 4 HRAS",
        steps: [
          { id: '1', title: 'Paso 1: Pre-inscripción en línea', content: 'Realiza tu pre-inscripción en el portal del SAT.' },
          { id: '2', title: 'Paso 2: Agenda una cita', content: 'Agenda una cita en la oficina del SAT más cercana.' },
          { id: '3', title: 'Paso 3: Acude a tu cita', content: 'Presenta tu documentación oficial para concluir el trámite.' },
          { id: '4', title: 'Paso 4: Obtén tu Acuse', content: 'Recibirás tu Acuse Único de Inscripción al RFC.' },
        ],
        documents: [
          { id: '1', name: 'CURP', description: 'Clave Única de Registro de Población.' },
        ],
      },
      {
        id: 'rfc-clon',
        slug: 'rfc-clon',
        name: 'Constancia de Situacion Fiscal Generica',
        description: 'Solicita una reimpresión de tu constancia del RFC. Nosotros nos encargamos del proceso y te entregamos el PDF.',
        cost: 50,
        deliveryTime: "10 minutos",
        steps: [
          { id: '1', title: 'Paso 1: Proporciona tu CURP', content: 'Ingresa tu Clave Única de Registro de Población para iniciar el trámite.' },
          { id: '2', title: 'Paso 2: Procesamiento Interno', content: 'Nuestro equipo administrativo gestionará la solicitud para obtener tu constancia.' },
          { id: '3', title: 'Paso 3: Carga de Documento', content: 'Un administrador subirá el documento PDF a tu cuenta.' },
          { id: '4', title: 'Paso 4: Descarga', content: 'Recibirás una notificación para que puedas descargar tu constancia RFC desde la plataforma.' },
        ],
        documents: [
          { id: '1', name: 'CURP', description: 'Tu Clave Única de Registro de Población, la usaremos para encontrar tu RFC.' },
        ],
      },
      {
        id: 'rfc-idcif',
        slug: 'rfc-idcif',
        name: 'Constancia de Situación Fiscal IDCIF',
        description: 'Gestionamos y te entregamos tu Cédula de Identificación Fiscal (CIF) oficial.',
        cost: 60,
        deliveryTime: "10 minutos",
        steps: [
            { id: '1', title: 'Paso 1: Proporciona tus datos', content: 'Ingresa tu RFC y tu ID CIF para iniciar.' },
            { id: '2', title: 'Paso 2: Procesamiento Interno', content: 'Nuestro equipo administrativo gestionará la solicitud para obtener tu constancia.' },
            { id: '3', title: 'Paso 3: Carga de Documento', content: 'Un administrador subirá el documento PDF a tu cuenta.' },
            { id: '4', title: 'Paso 4: Descarga', content: 'Recibirás una notificación para que puedas descargar tu constancia desde la plataforma.' },
        ],
        documents: [
            { id: '1', name: 'RFC', description: 'Tu Registro Federal de Contribuyentes.' },
            { id: '2', name: 'ID CIF', description: 'El identificador de tu Cédula de Identificación Fiscal.' },
        ],
      },
    ],
  },
  {
    id: 'documentos-personales',
    name: 'Documentos Personales',
    icon: Briefcase,
    services: [
        {
            id: 'antecedentes-no-penales',
            slug: 'antecedentes-no-penales',
            name: 'Certificado de Antecedentes No Penales',
            description: 'Obtén tu certificado que acredita la ausencia de antecedentes penales.',
            cost: 180,
            deliveryTime: "10 minutos",
             steps: [
                { id: '1', title: 'Paso 1: Solicitud en línea', content: 'Ingresa al portal de tu estado y llena la solicitud.' },
                { id: '2', title: 'Paso 2: Pago de derechos', content: 'Realiza el pago correspondiente en línea o en bancos.' },
                { id: '3', title: 'Paso 3: Descarga', content: 'Descarga tu certificado oficial.' },
            ],
            documents: [
                { id: '1', name: 'CURP', description: 'Clave Única de Registro de Población.' },
                { id: '2', name: 'Comprobante de Pago', description: 'Recibo del pago de derechos.' },
            ],
        },
        {
            id: 'actas-registro-civil',
            slug: 'actas-registro-civil',
            name: 'Actas del Registro Civil',
            description: 'Obtén copias certificadas de actas de nacimiento, matrimonio, divorcio o defunción.',
            cost: 120,
            deliveryTime: "10 minutos",
            steps: [
                { id: '1', title: 'Paso 1: Búsqueda', content: 'Ingresa los datos de la persona para buscar el acta.' },
                { id: '2', title: 'Paso 2: Pago de derechos', content: 'Realiza el pago en línea.' },
                { id: '3', title: 'Paso 3: Descarga', content: 'Descarga tu acta certificada en formato PDF.' },
            ],
            documents: [
                { id: '1', name: 'Datos del Registrado', description: 'Nombre completo, fecha y lugar de registro.' },
                { id: '2', name: 'Tipo de Acta', description: 'Nacimiento, Matrimonio, Divorcio o Defunción.' },
            ],
        },
    ]
  },
  {
    id: 'vehiculos',
    name: 'Vehículos y Transporte',
    icon: Car,
    services: [
      {
        id: 'poliza-seguro',
        slug: 'poliza-seguro',
        name: 'Póliza de Seguro Vehicular',
        description: 'Contrata o renueva la póliza de seguro para tu vehículo.',
        cost: 1500,
        deliveryTime: "10 minutos",
        steps: [
            { id: '1', title: 'Paso 1: Cotización', content: 'Proporciona los datos de tu vehículo para obtener una cotización.' },
            { id: '2', title: 'Paso 2: Elección de Cobertura', content: 'Elige la cobertura que mejor se adapte a tus necesidades.' },
            { id: '3', title: 'Paso 3: Contratación', content: 'Realiza el pago y emite tu póliza.' },
        ],
        documents: [
            { id: '1', name: 'Tarjeta de Circulación', description: 'Datos del vehículo a asegurar.' },
            { id: '2', name: 'Identificación Oficial del Contratante', description: 'Tu INE o Pasaporte.' },
            { id: '3', name: 'Licencia de Conducir', description: 'Licencia vigente del conductor habitual.' },
        ],
      },
      {
        id: 'permiso-circular-sin-placas',
        slug: 'permiso-circular-sin-placas',
        name: 'Permiso para Circular sin Placas',
        description: 'Obtén un permiso temporal para circular mientras realizas el trámite de placas.',
        cost: 350,
        deliveryTime: "10 minutos",
        steps: [
            { id: '1', title: 'Paso 1: Presentar Documentos', content: 'Acude a la oficina de tránsito con la factura del vehículo y tu identificación.' },
            { id: '2', title: 'Paso 2: Pago de Derechos', content: 'Realiza el pago por la expedición del permiso.' },
            { id: '3', title: 'Paso 3: Recepción de Permiso', content: 'Recibe el permiso temporal con vigencia definida.' },
        ],
        documents: [
            { id: '1', name: 'Factura o Carta Factura del Vehículo', description: 'Debe estar a tu nombre.' },
            { id: '2', name: 'Identificación Oficial', description: 'INE o Pasaporte vigente.' },
            { id: '3', name: 'Comprobante de Domicilio', description: 'No mayor a 3 meses.' },
        ],
      },
    ],
  },
  {
    id: 'educacion-salud',
    name: 'Educación y Salud',
    icon: HeartPulse,
    services: [
        {
            id: 'certificado-estudios',
            slug: 'certificado-estudios',
            name: 'Certificado de Estudios',
            description: 'Solicita un duplicado o valida tu certificado de estudios de cualquier nivel educativo.',
            cost: 300,
            deliveryTime: "10 minutos",
             steps: [
                { id: '1', title: 'Paso 1: Solicitud', content: 'Llena el formato de solicitud en la institución educativa o en línea.' },
                { id: '2', title: 'Paso 2: Pago de Derechos', content: 'Cubre la cuota por la expedición del certificado.' },
                { id: '3', title: 'Paso 3: Entrega', content: 'Recoge tu certificado en la fecha indicada.' },
            ],
            documents: [
                { id: '1', name: 'Identificación Oficial', description: 'Tu INE o Pasaporte.' },
                { id: '2', name: 'CURP', description: 'Clave Única de Registro de Población.' },
                { id: '3', name: 'Antecedente Académico', description: 'Certificado del nivel anterior, si aplica.' },
            ],
        },
        {
            id: 'receta-medica',
            slug: 'receta-medica',
            name: 'Receta Médica Digital',
            description: 'Genera una receta médica certificada por un profesional de la salud.',
            cost: 120,
            deliveryTime: "10 minutos",
            steps: [
                { id: '1', title: 'Paso 1: Consulta Virtual', content: 'Ten una teleconsulta con un médico certificado.' },
                { id: '2', title: 'Paso 2: Emisión de Receta', content: 'El médico emite la receta con firma digital.' },
                { id: '3', title: 'Paso 3: Recepción', content: 'Recibe la receta en tu correo o app para surtirla en farmacias.' },
            ],
            documents: [
                { id: '1', name: 'Historial Médico Breve', description: 'Síntomas y padecimientos actuales.' },
                { id: '2', name: 'Identificación Oficial', description: 'Para verificar tu identidad.' },
            ],
        },
        {
            id: 'incapacidad-medica',
            slug: 'incapacidad-medica',
            name: 'Justificante de Incapacidad Médica',
            description: 'Obtén un justificante de incapacidad médica para tu trabajo o escuela.',
            cost: 220,
            deliveryTime: "10 minutos",
            steps: [
                { id: '1', title: 'Paso 1: Valoración Médica', content: 'Un médico evaluará tu condición de salud.' },
                { id: '2', title: 'Paso 2: Emisión del Justificante', content: 'El médico expide el documento con los días de incapacidad.' },
                { id: '3', title: 'Paso 3: Envío', content: 'Recibe el justificante para presentarlo donde corresponda.' },
            ],
            documents: [
                { id: '1', name: 'Identificación Oficial', description: 'Para verificar tu identidad.' },
                { id_2: '2', name: 'Descripción de Síntomas', description: 'Detalla tu malestar al médico.' },
            ],
        },
    ]
  }
];

export const progressData: ProgressItem[] = [
    { id: 'P001', serviceName: 'Renovación de Pasaporte', status: 'En Proceso', currentStep: 3, totalSteps: 4, submittedDate: '2024-05-15', lastUpdate: '2024-05-20' },
    { id: 'P002', serviceName: 'Licencia de Conducir', status: 'Completado', currentStep: 4, totalSteps: 4, submittedDate: '2024-04-10', lastUpdate: '2024-04-25' },
    { id: 'P003', serviceName: 'Registro de Negocio', status: 'Iniciado', currentStep: 1, totalSteps: 4, submittedDate: '2024-05-22', lastUpdate: '2024-05-22' },
    { id: 'P004', serviceName: 'Permiso de Construcción', status: 'Rechazado', currentStep: 2, totalSteps: 5, submittedDate: '2024-03-01', lastUpdate: '2024-03-15' },
];

    
    

    
