import { ArrowDropdwonIcon } from "../../../../../../public/icons/icons";

interface FormData {
  id: number | null;
  p_surname: string;
  m_surname: string;
  name: string;
  test: string;
  employeeNumber: string;
  age: number | null;
  genre: string;
  category: string;
  height: number | null;
  weight: number | null;
  imc: number | null;
  waist: number | null;
  bmi: number | null;
  bmr: number | null;
  grease: number | null;
  fat_mass: number | null;
  ffm: number | null;
  tbw: number | null;
  grip: number | null;
  grip_points: number | null;
  jump: number | null;
  jump_points: number | null;
  agility: number | null;
  agility_points: number | null;
  resistance: string;
  resistance_points: number | null;
  total: number | null;
}

interface TestControlledDropdownProps {
  isGenreOpen: boolean;
  setIsGenreOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedGenre?: string;
  setSelectedGenre?: React.Dispatch<React.SetStateAction<string>>;
  originalFormData: FormData | undefined;
}

export function GenreControlledDropdown ({
    isGenreOpen,
    setIsGenreOpen,
    selectedGenre,
    setSelectedGenre,
    originalFormData,
  }: TestControlledDropdownProps ) {

  const options = ["HOMBRE", "MUJER"]

  const handleOptionClick = (option: string) => {
    if (setSelectedGenre) {
      setSelectedGenre(option);
    }
    setIsGenreOpen(false);
  };

  const toggleDropdown = () => {
    setIsGenreOpen(!isGenreOpen);
  };

  return (
    <>
      <div
        className={`dropdown ${
          isGenreOpen ? 'outline outline-[1.4px] -outline-offset-1 outline-[#2563eb]' : ''
        } ${
          selectedGenre === originalFormData?.genre ? '' : `${selectedGenre ? 'bg-gray-200' : ''}`
        }`}
      >
        <div className="dropdown-header" onClick={toggleDropdown}>
          <p className={`${selectedGenre ? 'text-black text-sm font-normal' : ''}`}>
            {selectedGenre || 'Selecciona una opción'}
          </p>
          <span className={`dropdown-arrow transition-all ease-out ${isGenreOpen ? 'open' : ''}`}>
            <ArrowDropdwonIcon />
          </span>
        </div>
        <div
          className={`dropdown-menu transition-all duration-100 ease-in-out shadow-lg ${
            isGenreOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {options.map((option) => (
            <div
              key={option}
              className="dropdown-item font-semibold text-gray-600"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}