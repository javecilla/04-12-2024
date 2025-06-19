declare module 'aos' {
  interface AOSSettings {
    offset?: number;
    duration?: number;
    easing?: string;
    delay?: number;
    anchor?: string;
    placement?: string;
    once?: boolean;
    mirror?: boolean;
    anchorPlacement?: string;
    startEvent?: string;
  }

  interface AOS {
    init(settings?: AOSSettings): void;
    refresh(force?: boolean): void;
    refreshHard(): void;
  }

  const aos: AOS;
  export default aos;
}
