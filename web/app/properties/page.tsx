import { Suspense } from "react";
import Header from "@/components/Header";
import PropertiesContent from "./PropertiesContent";
import { getPropertiesServer, searchParamsToFilters } from "@/lib/property";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const filters = searchParamsToFilters(resolvedParams);
  const properties = await getPropertiesServer(filters);

  return (
    <>
      <Header />
      <Suspense>
        <PropertiesContent properties={properties} />
      </Suspense>
    </>
  );
}
