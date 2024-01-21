import { Popper } from "@mui/base";
import { useState } from "react";
import { Checkbox } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChevronDownIcon } from "../../icons/chevron-down";
import { CircleIcon } from "../../icons/circle-icon";
import { CircleCheckIcon } from "../../icons/circle-checked-icon";

interface DropdownOptions {
  label: string;
  id: string;
  value: string;
  type: string;
}

interface DropdownProps {
  value: string;
  options: DropdownOptions[];
  onOptionChange: (selectedValue: { value: string; type: string }) => void;
  isCustomSelected: boolean;
}
const SelectionDropdown = (props: DropdownProps) => {
  const { value, options, onOptionChange, isCustomSelected = false } = props;

  const [selected, setSelected] = useState<string>(value);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [customSelected, setCustomSelected] =
    useState<boolean>(isCustomSelected);

  const handleChange = (event: any) => {
    const selectedOption = options.find(
      (optionItem) => optionItem.value === event.currentTarget.innerText
    );
    setSelected(selectedOption?.value || options[0].value);
    if (customSelected) setCustomSelected(false);
    if (selectedOption)
      onOptionChange({
        value: selectedOption.value,
        type: selectedOption.type,
      });
    setAnchorEl(null);
  };

  return (
    <>
      <div
        className="flex flex-row justify-between items-center tertiaryBtn cursor-pointer"
        onClick={(event) => {
          setAnchorEl(anchorEl ? null : event.currentTarget);
        }}
      >
        <span>{selected}</span>
        <ChevronDownIcon customColor="rgb(115,115,115)" />
      </div>

      <Popper
        id="popper"
        open={anchorEl !== null ? true : false}
        anchorEl={anchorEl}
        className="flex flex-col popperClass"
      >
        {options.map((option) => {
          switch (option.type) {
            case "select":
              return (
                <div
                  className="flex flex-row items-center justify-between popperSelectionItems cursor-pointer"
                  onClick={handleChange}
                  key={option.id}
                >
                  <span>{option.value}</span>
                  <Checkbox
                    checked={selected === option.value && !customSelected}
                    icon={
                      <CircleIcon customColor="white" width={24} height={24} />
                    }
                    checkedIcon={
                      <CircleCheckIcon
                        customColor="white"
                        width={24}
                        height={24}
                      />
                    }
                    className="checkbox"
                  />
                </div>
              );
            case "textinput":
              return (
                <div>
                  <div className="flex flex-row items-center justify-between popperSelectionItems cursor-pointer">
                    <span>{option.label}</span>
                    <Checkbox
                      checked={customSelected}
                      icon={
                        <CircleIcon
                          customColor="white"
                          width={24}
                          height={24}
                        />
                      }
                      checkedIcon={
                        <CircleCheckIcon
                          customColor="white"
                          width={24}
                          height={24}
                        />
                      }
                      className="checkbox"
                    />
                  </div>
                  <div className="px-6 pb-3">
                    <textarea
                      onChange={(event) => {
                        debugger;
                        setSelected(event.currentTarget.value);
                        onOptionChange({
                          value: event.currentTarget.value,
                          type: "Custom",
                        });
                      }}
                      className="inputPrimary w-[316px] h-[56px]"
                      value={customSelected ? selected : ""}
                    />
                  </div>
                </div>
              );
          }
        })}
      </Popper>
    </>
  );
};

export default SelectionDropdown;
