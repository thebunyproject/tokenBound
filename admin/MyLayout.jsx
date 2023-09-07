// in src/admin/MyLayout.tsx
import { CheckForApplicationUpdate, Layout, LayoutProps } from "react-admin";

export const MyLayout = ({ children, ...props }) => (
    <Layout {...props}>
        {children}
        <CheckForApplicationUpdate />
    </Layout>
);