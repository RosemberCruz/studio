import type { LucideIcon } from 'lucide-react';
import { Building, Briefcase, Car, GraduationCap, Home, FileText } from 'lucide-react';

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
    id: 'identidad',
    name: 'Identidad y Pasaportes',
    icon: FileText,
    services: [
      {
        id: 'renovacion-pasaporte',
        slug: 'renovacion-pasaporte',
        name: 'Renovación de Pasaporte',
        description: 'Guía completa para renovar tu pasaporte de manera eficiente.',
        steps: [
          { id: '1', title: 'Paso 1: Reunir Documentación', content: 'Junta tu pasaporte actual, una foto tamaño pasaporte reciente, y tu DNI.' },
          { id: '2', title: 'Paso 2: Rellenar Formulario DS-82', content: 'Completa el formulario DS-82 online o a mano. Asegúrate de firmarlo.' },
          { id: '3', title: 'Paso 3: Realizar el Pago', content: 'Paga la tarifa de renovación online o en una entidad bancaria autorizada.' },
          { id: '4', title: 'Paso 4: Enviar Solicitud', content: 'Envía tu pasaporte actual, el formulario DS-82, la foto y el comprobante de pago por correo certificado.' },
        ],
        documents: [
          { id: '1', name: 'Pasaporte Actual', description: 'Debe estar en buen estado.' },
          { id: '2', name: 'Formulario DS-82', description: 'Completado y firmado.' },
          { id: '3', name: 'Foto Tamaño Pasaporte', description: 'Fondo blanco, sin sonreír.' },
          { id: '4', name: 'Comprobante de Pago', description: 'Recibo del pago de la tarifa.' },
        ],
      },
    ],
  },
  {
    id: 'vehiculos',
    name: 'Vehículos y Transporte',
    icon: Car,
    services: [
      {
        id: 'licencia-conducir',
        slug: 'licencia-conducir',
        name: 'Obtener Licencia de Conducir por Primera Vez',
        description: 'Pasos para obtener tu licencia de conducir.',
        steps: [
            { id: '1', title: 'Paso 1: Curso de Conducción', content: 'Completa un curso de conducción teórico y práctico en una escuela autorizada.' },
            { id: '2', title: 'Paso 2: Examen Médico', content: 'Realiza un examen médico para certificar tu aptitud física y mental.' },
            { id: '3', title: 'Paso 3: Examen Teórico', content: 'Aprueba el examen teórico sobre las reglas de tránsito.' },
            { id: '4', title: 'Paso 4: Examen Práctico', content: 'Supera el examen práctico de manejo en el circuito oficial.' },
        ],
        documents: [
            { id: '1', name: 'DNI o Carnet de Extranjería', description: 'Documento de identidad vigente.' },
            { id: '2', name: 'Certificado de Curso de Conducción', description: 'Emitido por una escuela autorizada.' },
            { id: '3', name: 'Certificado de Examen Médico', description: 'De un centro médico autorizado.' },
            { id: '4', name: 'Comprobante de Pago', description: 'Por los derechos de examen y emisión.' },
        ],
      },
    ],
  },
   {
    id: 'negocios',
    name: 'Negocios y Empresas',
    icon: Briefcase,
    services: [
        {
            id: 'registro-negocio',
            slug: 'registro-negocio',
            name: 'Registro de un Nuevo Negocio',
            description: 'Guía para registrar formalmente tu emprendimiento.',
            steps: [
                { id: '1', title: 'Paso 1: Elección de Estructura Legal', content: 'Decide si serás persona natural con negocio, EIRL, S.A.C., etc.' },
                { id: '2', title: 'Paso 2: Búsqueda y Reserva de Nombre', content: 'Verifica la disponibilidad del nombre de tu empresa y resérvalo.' },
                { id: '3', title: 'Paso 3: Elaboración de la Minuta', content: 'Redacta el acto constitutivo de la empresa con un abogado.' },
                { id: '4', title: 'Paso 4: Inscripción en Registros Públicos', content: 'Eleva la minuta a escritura pública e inscríbela.' },
            ],
            documents: [
                { id: '1', name: 'Formato de Reserva de Nombre', description: 'Aprobado por la entidad registral.' },
                { id: '2', name: 'Minuta de Constitución', description: 'Firmada por los socios y el abogado.' },
                { id: '3', name: 'DNI de los Socios', description: 'Copias de los documentos de identidad.' },
                { id: '4', name: 'Comprobante de Depósito de Capital', description: 'Voucher del banco.' },
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
