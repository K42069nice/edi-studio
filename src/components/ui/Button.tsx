type ButtonProps = {
  children: React.ReactNode;
};

export default function Button({ children }: ButtonProps) {
  return (
    <button
      className="
      bg-blue-600
      hover:bg-blue-700
      transition
      px-8
      py-4
      rounded-xl
      text-lg
      font-semibold
      "
    >
      {children}
    </button>
  );
}