"use client"

import { useState } from "react";
import { getUser, getVideos } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCard } from "@/components/video/video-card";
import { Settings } from "lucide-react";

export default function ProfilePage() {
  // In a real app, you'd get the logged-in user's ID
  const user = getUser("user_1");
  const allVideos = getVideos();
  
  if (!user) {
    return <div>User not found</div>;
  }

  const userVideos = allVideos.filter(video => video.uploaderId === user.id);
  const likedVideos = allVideos.slice(0, 5); // Mock liked videos

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-24 w-24 border-4 border-primary">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-muted-foreground">@{user.id}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-bold">{userVideos.length}</p>
            <p className="text-sm text-muted-foreground">Videos</p>
          </div>
          <div className="text-center">
            <p className="font-bold">1.2M</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <p className="font-bold">345</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button>Follow</Button>
            <Button variant="outline">Message</Button>
            <Button variant="ghost" size="icon">
                <Settings />
            </Button>
        </div>
      </div>

      <Tabs defaultValue="videos" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="liked">Liked</TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
            {userVideos.map((video) => (
              <VideoCard key={video.id} video={video} orientation="vertical" />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="liked">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
            {likedVideos.map((video) => (
              <VideoCard key={video.id} video={video} orientation="vertical" />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
