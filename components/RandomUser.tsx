"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import Image from "next/image";
import { CSSTransition } from "react-transition-group";
import { MailIcon, MapPinIcon, UserIcon, InfoIcon } from "lucide-react";

interface User {
  name: string;
  email: string;
  address: string;
  image: string;
  description: string;
}

function RandomUser() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appreciationVisible, setAppreciationVisible] = useState<boolean>(false);

  const fetchRandomUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("https://randomuser.me/api/");
      const data = await response.json();
      const fetchedUser = data.results[0];
      const newUser: User = {
        name: `${fetchedUser.name.first} ${fetchedUser.name.last}`,
        email: fetchedUser.email,
        address: `${fetchedUser.location.street.number} ${fetchedUser.location.street.name}, ${fetchedUser.location.city}, ${fetchedUser.location.country}`,
        image: fetchedUser.picture.large,
        description: fetchedUser.login.uuid,
      };
      setUser(newUser);
    } catch {
      setError("Failed to fetch user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomUser();
  }, []);

  const handleAppreciate = () => {
    setAppreciationVisible(true);
    setTimeout(() => setAppreciationVisible(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-foreground px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Random User Generator</h1>
      <p className="text-muted-foreground mb-6 text-center">
        Click the button below to fetch a random user profile.
      </p>
      <Button onClick={fetchRandomUser} className="mb-6">
        Fetch New User
      </Button>
      {loading && (
        <div className="flex flex-col gap-3 my-2 items-center justify-center">
          <BarLoader />
          <span>Loading...</span>
        </div>
      )}
      {error && <div className="text-red-500 text-center">{error}</div>}
      {user && (
        <Card className="border-0 shadow-lg rounded-lg overflow-hidden max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl relative">
          <CardHeader className="h-32 bg-gradient-to-t from-gray-500 via-gray-700 to-black relative">
            <Image
              src={user.image}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-full border-4 border-white absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
            />
          </CardHeader>
          <CardContent className="p-6 pt-12 text-center">
            <CardTitle className="text-xl font-bold flex items-center justify-center">
              <UserIcon className="mr-2" /> {user.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground flex items-center justify-center">
              <MailIcon className="mr-2" /> {user.email}
            </CardDescription>
            <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center">
              <MapPinIcon className="mr-2" /> {user.address}
            </div>
            <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center">
              <InfoIcon className="mr-2" /> {user.description}
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full md:w-auto"
              onClick={handleAppreciate}
            >
              Appreciate
            </Button>
          </CardContent>
          <CSSTransition
            in={appreciationVisible}
            timeout={300}
            classNames="appreciation"
            unmountOnExit
          >
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75">
              <h2 className="text-2xl font-bold text-black text-center">❤️ Thank you ✨</h2>
            </div>
          </CSSTransition>
        </Card>
      )}
    </div>
  )
}

export default RandomUser
