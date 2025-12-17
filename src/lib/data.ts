
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
  imageUrl: string;
  imageHint: string;
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
        imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/ceb65f70-d1e5-4f40-9a84-0679776d5427.png',
        imageHint: 'tax logo',
        steps: [
          { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
          { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
          { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
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
        imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/ceb65f70-d1e5-4f40-9a84-0679776d5427.png',
        imageHint: 'tax logo',
        steps: [
          { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
          { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
          { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
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
        imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/a45a2784-0985-4519-8131-4b1369a48d88.png',
        imageHint: 'tax document',
        steps: [
            { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
            { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
            { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
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
            cost: 100,
            deliveryTime: "20 minutos",
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/d2170367-937d-4113-adaf-557375e2f754.png',
            imageHint: 'legal document',
             steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
            ],
            documents: [
                { id: '1', name: 'Nombre Completo', description: 'Tal como aparece en tu identificación.' },
                { id: '2', name: 'CURP', description: 'Clave Única de Registro de Población.' },
                { id: '3', name: 'Fecha de Nacimiento', description: 'Tu fecha de nacimiento completa.' },
                { id: '4', name: 'Domicilio', description: 'Tu dirección de residencia actual.' },
                { id: '5', name: 'Clave de Elector', description: 'Se encuentra en tu credencial del INE.' },
                { id: '6', name: 'Estado', description: 'El estado en el que solicitarás el antecedente no penal.' },
            ],
        },
        {
            id: 'actas-registro-civil',
            slug: 'actas-registro-civil',
            name: 'Actas del Registro Civil',
            description: 'Obtén copias certificadas de actas de nacimiento, matrimonio, divorcio o defunción.',
            cost: 50,
            deliveryTime: "10 minutos",
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/b0f19ac5-c6e3-40f4-8a4b-e8533b379965.png',
            imageHint: 'birth certificate',
            steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
            ],
            documents: [
                { id: '1', name: 'CURP', description: 'Clave Única de Registro de Población de la persona registrada.' },
                { id: '2', name: 'Tipo de Acta', description: 'Nacimiento, Matrimonio, Divorcio o Defunción.' },
            ],
        },
        {
            id: 'semanas-cotizadas',
            slug: 'semanas-cotizadas',
            name: 'Semanas Cotizadas',
            description: 'Consulta y obtén tu constancia de semanas cotizadas ante el IMSS.',
            cost: 30,
            deliveryTime: "15 minutos",
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/e0e1e69b-3c35-4e78-9e5c-20516b3f7f07.png',
            imageHint: 'social security',
            steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
            ],
            documents: [
                { id: '1', name: 'CURP', description: 'Clave Única de Registro de Población.' },
                { id: '2', name: 'Número de Seguridad Social (NSS)', description: 'Tu número de afiliación al IMSS.' },
            ],
        },
        {
            id: 'vigencia-derechos-nss',
            slug: 'vigencia-derechos-nss',
            name: 'Constancia de Vigencia de Derecho NSS',
            description: 'Obtén tu constancia de vigencia de derechos del IMSS usando tu CURP.',
            cost: 40,
            deliveryTime: "15 minutos",
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/e0e1e69b-3c35-4e78-9e5c-20516b3f7f07.png',
            imageHint: 'social security document',
            steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
            ],
            documents: [
                { id: '1', name: 'CURP', description: 'Clave Única de Registro de Población.' },
                { id: '2', name: 'Número de Seguridad Social (NSS)', description: 'Tu número de afiliación al IMSS.' },
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
        description: 'POLIZA DE SEGURO ADMINISTRATIVO POR 1 AÑO',
        cost: 130,
        deliveryTime: "10 minutos",
        imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/238b7157-555f-46df-98c4-a3f1244463c2.png',
        imageHint: 'car insurance',
        steps: [
            { id: '1', title: 'Solicitar Trámite', content: 'PROPORCIONA LOS DATOS DE TU VEHICULO PARA SOLICTAR EL TRAMITE' },
            { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
            { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
        ],
        documents: [
            { id: '1', name: 'Nombre del Conductor', description: 'Nombre completo del conductor habitual.' },
            { id: '2', name: 'Número de Serie', description: 'También conocido como VIN.' },
            { id: '3', name: 'Número de Motor', description: 'Se encuentra en la tarjeta de circulación.' },
            { id: '4', name: 'Placas', description: 'Número de placas del vehículo.' },
            { id: '5', name: 'Domicilio', description: 'Dirección completa del contratante.' },
            { id: '6', name: 'Modelo', description: 'Año del vehículo.' },
            { id: '7', name: 'Marca', description: 'Marca del vehículo.' },
        ],
      },
      {
        id: 'permiso-circular-sin-placas',
        slug: 'permiso-circular-sin-placas',
        name: 'Permiso para Circular sin Placas',
        description: 'Obtén un permiso temporal para circular mientras realizas el trámite de placas.',
        cost: 160,
        deliveryTime: "1 hora",
        imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/32bb649c-a1b7-4e38-89c0-9d0d346fe18f.png',
        imageHint: 'temporary permit',
        steps: [
            { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
            { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
            { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
        ],
        documents: [
            { id: '1', name: 'Nombre del Propietario', description: 'Nombre completo tal como aparece en la factura.' },
            { id: '2', name: 'Modelo', description: 'Año del vehículo.' },
            { id: '3', name: 'Línea', description: 'Línea o versión específica del vehículo.' },
            { id: '4', name: 'Color', description: 'Color exterior del vehículo.' },
            { id: '5', name: 'Número de Motor', description: 'Se encuentra en la factura o tarjeta de circulación.' },
            { id: '6', name: 'Número de Serie (VIN)', description: 'Número de Identificación Vehicular.' },
            { id: '7', name: 'Dirección', description: 'Dirección completa del propietario.' },
            { id: '8', name: 'Estado', description: 'Solicita para Guerrero, EDOMEX o CDMX.' },
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
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/4134b22c-a251-4f3b-8515-5152865c3637.png',
            imageHint: 'school certificate',
             steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
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
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/51296cc6-13a8-450f-a391-72a3e5e18237.png',
            imageHint: 'medical prescription',
            steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
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
            imageUrl: 'https://storage.googleapis.com/studiop-artifacts/google-project-images/studio-8783231251-fea41/436069048916/d32f50d1-d250-4fe7-9130-31626f21c561.png',
            imageHint: 'doctor note',
            steps: [
                { id: '1', title: 'Solicitar Trámite', content: 'Ingresa los datos requeridos para iniciar tu solicitud.' },
                { id: '2', title: 'Verificar estatus del trámite', content: 'Un administrador revisará y procesará tu solicitud.' },
                { id: '3', title: 'Descargar PDF', content: 'Recibirás una notificación cuando tu documento esté listo para descargar.' },
            ],
            documents: [
                { id: '1,', name: 'Identificación Oficial', description: 'Para verificar tu identidad.' },
                { id: '2,', name: 'Descripción de Síntomas', description: 'Detalla tu malestar al médico.' },
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

    
    

    





















