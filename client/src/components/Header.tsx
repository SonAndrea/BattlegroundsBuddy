import "./Header.css";

interface HeaderProps {
  children: string;
  onClick: () => void;
}

function Header({ children, onClick }: HeaderProps) {
  return (
    <header className="app-header">
      <h1>Battlegrounds Buddy</h1>
      <button type="button" className={"btn btn-dark"} onClick={onClick}>
        {children}
      </button>
    </header>
  );
}

export default Header;
