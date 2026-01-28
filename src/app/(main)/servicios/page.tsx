import { servicesData } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ServicesDirectoryPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Directorio de Servicios</h1>
        <p className="text-muted-foreground mt-2">
          Encuentra guías paso a paso para tus trámites y procedimientos.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Buscar un servicio..." className="pl-10 text-base" />
      </div>

      <div className="space-y-10">
        {servicesData.map((category) => (
          <div key={category.id}>
            <div className="flex items-center gap-3 mb-4">
              <category.icon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold font-headline">{category.name}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.services.map((service) => (
                <Link href={`/servicios/${service.slug}`} key={service.id} className="group">
                  <Card className="h-full hover:border-primary transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex flex-col overflow-hidden">
                    <div className="relative aspect-video w-full">
                        <Image 
                            src={service.imageUrl} 
                            alt={service.name} 
                            fill
                            className="object-cover"
                            data-ai-hint={service.imageHint}
                        />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <CardHeader>
                        <CardTitle>{service.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <CardDescription>{service.description}</CardDescription>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
