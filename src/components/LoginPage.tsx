import React ,{ useState} from 'react'
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {toast} from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Award, Lock, Smartphone } from 'lucide-react';

function LoginPage() {

    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")
    const {login} = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // validate phone number with regex
        if (!/^\d{10}$/.test(phone)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        // validate password length

         if (!/^\d{4}$/.test(password)) {
      toast.error('Please enter a 4-digit password');
      return;
    }

    const result = login(phone,password);
    if(result.success){
        toast.success(result.message);
    }else{
        toast.error(result.message);
    }

    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Award className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">HabitForge</h1>
          <p className="text-muted-foreground">Forge your routine, master your life.</p>
        </div>

        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>
              Enter your mobile number and 4-digit password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                  Mobile Number
                </label>
                <Input
                  type="tel"
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="text-lg tracking-wider h-12"
                  maxLength={10}
                />
                <p className="text-xs text-muted-foreground">{phone.length}/10 digits</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  4-Digit Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter 4-digit password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="text-lg tracking-[0.5em] text-center h-12"
                  maxLength={4}
                />
                <div className="flex justify-center gap-2 mt-2">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        password.length > i ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold">
                Continue
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-6">
              New user? Don't worry your account will be created automatically
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;