import Authentication from "@/app/_components/Authentication";
import ProfileAvatar from "@/app/_components/ProfileAvatar";
import { useAuthContext } from "@/app/provider"

const Navbar = () => {
    const user = useAuthContext();
  
    return (
      <nav className="flex w-full items-center justify-between border-t border-b  px-4 py-4 border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
          <h1 className="text-base text-white font-bold md:text-2xl">
            {" "}
            SketchByte
          </h1>
        </div>
        {!user?.user?.email ? (
          <Authentication>
            <button className="w-24 transform rounded-lg  px-6 py-2 font-medium  transition-all duration-300 hover:-translate-y-0.5  md:w-32 bg-white text-black hover:bg-gray-200">
              Login
            </button>{" "}
          </Authentication>
        ) : (
          <ProfileAvatar />
        )}
      </nav>
    );
  };

  export default Navbar;