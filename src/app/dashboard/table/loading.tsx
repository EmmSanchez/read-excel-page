import { LoaderIcon } from "../../../../public/icons/icons";

export default function Loading() {
  return (
    <>
      <div className="flex mt-40 mx-4 justify-center ">
        <LoaderIcon className="w-12 h-12 animate-spin"/>
      </div>
    </>
  )
}