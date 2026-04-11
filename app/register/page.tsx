import { RegisterForm } from "../../features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-4 py-12 sm:px-6">
      <RegisterForm />
    </div>
  );
}
