import Image from "next/image";
import screenshotSrc from "../assets/screenshot.png";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold mt-6">PWA для списка продуктов</h1>
        <p className="text-xl mt-4">
          Управляй списком продуктов вместе с членами семьи
        </p>
        <div className="flex flex-wrap justify-around mt-10">
          <div className="p-4">
            <p>Простой интерфейс</p>
          </div>
          <div className="p-4">
            <p>Реактивное обновление</p>
          </div>
          <div className="p-4">
            <p>Расшариваемые списки</p>
          </div>
        </div>
        <div className="mt-10">
          <Image
            src={screenshotSrc}
            alt="Mobile Screenshot"
            className="w-full"
          />
        </div>
        <a href="https://app.my-groceries.ru" className="mt-10 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 cursor-pointer">
          Перейти
        </a>
      </div>
    </div>
  );
}
