import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Shield, Clock, MapPin, Phone, Mail, Award } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NewHope Hospital</h1>
                <p className="text-sm text-gray-600">Excellence in Nigerian Healthcare</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Staff Login</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="bg-green-600 hover:bg-green-700">Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">Serving Nigeria Since 1985</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Leading Healthcare Excellence in <span className="text-green-600">Nigeria</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            NewHope Hospital is committed to providing world-class medical care to the people of Nigeria. Located in the
            heart of Lagos, we serve patients from across West Africa with cutting-edge technology and compassionate
            care.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Book Appointment
            </Button>
            <Button size="lg" variant="outline">
              Emergency Services
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">38+</div>
              <div className="text-green-100">Years of Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-green-100">Medical Specialists</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Beds Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-green-100">Patients Served Annually</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
            <p className="text-xl text-gray-600">Comprehensive healthcare solutions for all Nigerians</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>General Medicine</CardTitle>
                <CardDescription>
                  Comprehensive primary healthcare services including preventive care, diagnosis, and treatment of
                  common illnesses affecting Nigerians.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Cardiology</CardTitle>
                <CardDescription>
                  Advanced heart care services including treatment for hypertension, heart disease, and cardiac
                  emergencies common in Nigeria.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Emergency Care</CardTitle>
                <CardDescription>
                  24/7 emergency services equipped to handle trauma, accidents, and medical emergencies across Lagos and
                  surrounding areas.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Pediatrics</CardTitle>
                <CardDescription>
                  Specialized care for children including immunizations, growth monitoring, and treatment of childhood
                  diseases prevalent in Nigeria.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-600 mb-4" />
                <CardTitle>Maternity Care</CardTitle>
                <CardDescription>
                  Comprehensive maternal health services including prenatal care, safe delivery, and postnatal support
                  for Nigerian mothers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Award className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Specialized Surgery</CardTitle>
                <CardDescription>
                  Advanced surgical procedures performed by Nigeria's leading surgeons using state-of-the-art medical
                  technology.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit NewHope Hospital</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Main Campus</h3>
                    <p className="text-gray-600">
                      123 Ikoyi Medical Center
                      <br />
                      Victoria Island, Lagos State
                      <br />
                      Nigeria, 101241
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Contact Numbers</h3>
                    <p className="text-gray-600">
                      Emergency: +234 (0) 1 234 5678
                      <br />
                      General: +234 (0) 1 234 5679
                      <br />
                      Appointments: +234 (0) 1 234 5680
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">
                      info@newhopehospital.ng
                      <br />
                      emergency@newhopehospital.ng
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Operating Hours</h3>
                    <p className="text-gray-600">
                      Emergency: 24/7
                      <br />
                      Outpatient: Mon-Fri 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 2:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>About NewHope Hospital</CardTitle>
                <CardDescription>Leading healthcare institution in Nigeria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Established in 1985, NewHope Hospital has been at the forefront of medical excellence in Nigeria. We
                  are accredited by the Nigerian Medical Association and recognized by the Federal Ministry of Health.
                </p>
                <p className="text-gray-600">
                  Our mission is to provide accessible, affordable, and quality healthcare to all Nigerians, regardless
                  of their background or economic status.
                </p>
                <div className="pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Certifications & Awards</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Nigerian Medical Association Accredited</li>
                    <li>• ISO 9001:2015 Quality Management Certified</li>
                    <li>• Best Hospital in Lagos State 2023</li>
                    <li>• Excellence in Patient Care Award 2022</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">NewHope Hospital</span>
              </div>
              <p className="text-gray-400">Excellence in Nigerian Healthcare since 1985</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-white">
                    Staff Login
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Book Appointment
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Emergency
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>General Medicine</li>
                <li>Emergency Care</li>
                <li>Maternity Services</li>
                <li>Pediatrics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Victoria Island, Lagos</li>
                <li>+234 (0) 1 234 5678</li>
                <li>info@newhopehospital.ng</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 NewHope Hospital System. All rights reserved. Proudly serving Nigeria.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
