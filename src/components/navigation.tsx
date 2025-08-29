import { DarkThemeToggle } from "flowbite-react";
import {
  MegaMenu,
  NavbarBrand,
} from "flowbite-react";

function NavigationBar() {
  return (
    <MegaMenu className="absolute top-0 w-full">
      <NavbarBrand href="/">
        <img alt="" src="/favicon.svg" className="mr-3 h-6 sm:h-9" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Compilance</span>
      </NavbarBrand>
       <DarkThemeToggle />
    </MegaMenu>
  );
}


export default NavigationBar;