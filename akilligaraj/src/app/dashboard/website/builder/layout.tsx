import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ateşnak - Site Builder",
};

export default function WebsiteBuilderLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We remove the default dashboard padding here by using negative margins or a full-bleed wrapper
    // depending on how the parent layout works. Assuming parent has padding, we might just return children 
    // and handle full height in the page component.
    return (
        <div className="h-full w-full">
            {children}
        </div>
    );
}
