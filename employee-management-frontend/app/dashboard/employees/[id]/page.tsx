'use client';
import EmployeeDetail from '@/components/dashboard/EmployeeDetail';
import { useParams } from 'next/navigation';

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params?.id;

  return <EmployeeDetail id={id} />;
}
