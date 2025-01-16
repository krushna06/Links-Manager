import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, ArrowRight, Folder, LinkIcon, Search } from 'lucide-react'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to Link Manager</h1>
      <p className="text-xl mb-8 text-center">Organize, access, and share your links with ease</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Organize</CardTitle>
            <CardDescription>Keep your links tidy</CardDescription>
          </CardHeader>
          <CardContent>
            <Folder className="w-12 h-12 mb-4 text-primary" />
            <p>Create folders and categorize your links for easy access and management.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Access</CardTitle>
            <CardDescription>Your links, anywhere</CardDescription>
          </CardHeader>
          <CardContent>
            <LinkIcon className="w-12 h-12 mb-4 text-primary" />
            <p>Access your links from any device, at any time. Never lose an important resource again.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
            <CardDescription>Find in an instant</CardDescription>
          </CardHeader>
          <CardContent>
            <Search className="w-12 h-12 mb-4 text-primary" />
            <p>Quickly find the link you need with our powerful search functionality.</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full max-w-2xl mb-12">
        <CardHeader>
          <CardTitle>Why Choose Link Manager?</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Intuitive Organization</AccordionTrigger>
              <AccordionContent>
                Our folder system allows you to organize your links in a way that makes sense to you. Create, rename, and manage folders with ease.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Powerful Search</AccordionTrigger>
              <AccordionContent>
                Find any link in seconds with our advanced search feature. Search across all your folders or within specific categories.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Drag and Drop</AccordionTrigger>
              <AccordionContent>
                Effortlessly organize your links with our intuitive drag and drop interface. Move links between folders with a simple gesture.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Secure and Private</AccordionTrigger>
              <AccordionContent>
                Your data is important to us. We use industry-standard encryption to ensure your links and personal information remain secure.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-2xl">
  <CardHeader>
    <CardTitle>Get Started in 3 Easy Steps</CardTitle>
  </CardHeader>
  <CardContent>
    <ol className="space-y-4">
      <li className="flex items-center">
        <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
        <span>Sign up for an account</span>
      </li>
      <li className="flex items-center">
        <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
        <span>Create folders and add your links</span>
      </li>
      <li className="flex items-center">
        <CheckCircle className="text-green-500 mr-2 flex-shrink-0" />
        <span>Access your links from anywhere</span>
      </li>
    </ol>
  </CardContent>
  <CardFooter>
    <Link href="/login" className="w-full">
      <Button className="w-full">
        Get Started Now
        <ArrowRight className="ml-2" />
      </Button>
    </Link>
  </CardFooter>
</Card>
    </main>
  )
}

