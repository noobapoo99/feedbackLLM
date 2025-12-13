interface Props {
  onClick: () => void;
}

export default function FloatingButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 btn btn-primary rounded-full shadow-xl z-[100] "
    >
      🧠 Ask AI
    </button>
  );
}
