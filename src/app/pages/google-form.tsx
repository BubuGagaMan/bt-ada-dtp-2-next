import CustomForm from "../components/CustomForm";

export default function CustomFormPage() {
  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Feedback Form</h1>
      <CustomForm />
    </div>
  );
}
