import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, Eye, EyeOff, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PasswordStrength = "unsafe" | "safe" | "strong";

interface PasswordCheck {
  label: string;
  test: (password: string) => boolean;
}

const passwordChecks: PasswordCheck[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "Contains uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "Contains lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "Contains number", test: (pwd) => /\d/.test(pwd) },
  { label: "Contains special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
];

const generatePassword = (): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*(),.?\":{}|<>";
  
  const allChars = lowercase + uppercase + numbers + symbols;
  const mandatoryChars = [
    lowercase[Math.floor(Math.random() * lowercase.length)],
    uppercase[Math.floor(Math.random() * uppercase.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];
  
  const randomChars = Array.from({ length: 8 }, () => 
    allChars[Math.floor(Math.random() * allChars.length)]
  );
  
  const password = [...mandatoryChars, ...randomChars]
    .sort(() => Math.random() - 0.5)
    .join("");
    
  return password;
};

export const PasswordValidator = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getPasswordStrength = (pwd: string): PasswordStrength => {
    const passedChecks = passwordChecks.filter(check => check.test(pwd));
    
    if (passedChecks.length <= 2) return "unsafe";
    if (passedChecks.length <= 4) return "safe";
    return "strong";
  };

  const getStrengthConfig = (strength: PasswordStrength) => {
    switch (strength) {
      case "strong":
        return {
          color: "success",
          bgColor: "bg-success/10",
          borderColor: "border-success",
          textColor: "text-success",
          label: "Strong Password",
          progress: 100,
        };
      case "safe":
        return {
          color: "warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning",
          textColor: "text-warning",
          label: "Safe Password",
          progress: 60,
        };
      case "unsafe":
        return {
          color: "danger",
          bgColor: "bg-danger/10",
          borderColor: "border-danger",
          textColor: "text-danger",
          label: "Unsafe Password",
          progress: 30,
        };
    }
  };

  const strength = getPasswordStrength(password);
  const config = getStrengthConfig(strength);
  const passedChecks = passwordChecks.filter(check => check.test(password));

  const handleGeneratePassword = () => {
    setPassword(generatePassword());
  };

  const handleCopyPassword = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Password copied!",
        description: "Password has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-2 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple/10 to-blue/10">
        <CardTitle className="text-center bg-gradient-to-r from-purple to-blue bg-clip-text text-transparent">
          Password Validator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Enter Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`pr-20 ${config.borderColor} focus:ring-2 focus:ring-${config.color}/20`}
            />
            <div className="absolute right-0 top-0 flex">
              {password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-full w-10 text-emerald hover:text-emerald hover:bg-emerald/10"
                  onClick={handleCopyPassword}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-full w-10"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {password && (
          <>
            <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border-2 shadow-sm`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`font-semibold ${config.textColor}`}>
                  {config.label}
                </span>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${config.bgColor} ${config.textColor}`}>
                  {passedChecks.length}/{passwordChecks.length}
                </span>
              </div>
              <Progress 
                value={config.progress} 
                className="h-3 bg-muted"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Requirements:</h4>
              <ul className="space-y-2">
                {passwordChecks.map((check, index) => {
                  const passed = check.test(password);
                  const colors = ["emerald", "blue", "orange", "purple", "success"];
                  const color = colors[index] || "success";
                  return (
                    <li key={index} className="flex items-center space-x-3 text-sm">
                      <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        passed ? `bg-${color} shadow-sm` : "bg-muted border-2 border-muted-foreground/20"
                      }`} />
                      <span className={`transition-colors duration-300 ${
                        passed ? `text-${color} font-medium` : "text-muted-foreground"
                      }`}>
                        {check.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex gap-2">
              {strength === "unsafe" && (
                <Button 
                  onClick={handleGeneratePassword}
                  className="flex-1 bg-gradient-to-r from-emerald to-blue hover:from-emerald/90 hover:to-blue/90 text-white font-medium shadow-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Strong Password
                </Button>
              )}
              {password && strength !== "unsafe" && (
                <Button 
                  onClick={handleCopyPassword}
                  variant="outline"
                  className={`flex-1 border-2 ${config.borderColor} ${config.textColor} hover:${config.bgColor}`}
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Password"}
                </Button>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};