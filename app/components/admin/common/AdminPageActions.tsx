import { ReactNode } from "react";

interface AdminPageActionsProps {
  children: ReactNode;
}

const AdminPageActions = ({ children }: AdminPageActionsProps) => {
  return (
    <div className="fixed top-3 right-8 flex gap-5">
      {children}
    </div>
  );
};

export default AdminPageActions;
