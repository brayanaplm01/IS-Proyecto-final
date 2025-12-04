"use client";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {!pathname.startsWith('/admin') && <Header />} {/* Ocultar header en el dashboard y sus subrutas */}
      <main className="flex-1">{children}</main>
      {!pathname.startsWith('/admin') && <Footer />} {/* Ocultar footer en el dashboard y sus subrutas */}
      {/* Eliminar la renderización del componente Cart flotante */}
      {/* <Cart onOpenCheckoutModal={handleOpenCheckoutModal} /> */} 

      {/* Temporalmente comentado hasta arreglar las props de CheckoutModal
      {isCheckoutModalOpen && user && products.length > 0 && (
        <CheckoutModal 
          isOpen={isCheckoutModalOpen}
          onClose={handleCloseCheckoutModal}
          user={user}
          items={products}
          total={total()}
        />
      )}
      */}
    </>
  );
}
