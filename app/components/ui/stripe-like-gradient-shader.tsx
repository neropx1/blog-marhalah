
import { GradFlow } from 'gradflow'

interface StripeGradientShaderProps {
  className?: string;
}

export const StripeGradientShader = ({ className }: StripeGradientShaderProps) => {
  return (
    <div className={`absolute inset-0 w-full h-full ${className || ''}`}>
       
       <GradFlow config={{
        color1: { r: 25, g: 8, b: 0 },
        color2: { r: 0, g: 0, b: 0 },
        color3: { r: 106, g: 82, b: 42 },
        speed: 0.6,
        scale: 0.9,
        type: 'mesh',
        noise: 0.5
      }}/> 
    </div>
  );
};
