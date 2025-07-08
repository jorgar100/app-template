//frontend/src/composables/useTour.js

import { useShepherd } from 'vue-shepherd';

const defaultTourOptions = {
  useModalOverlay: true,
  exitOnEsc: true,
  keyboardNavigation: true,
  defaultStepOptions: {
    cancelIcon: {
      enabled: true
    },
    classes: 'shepherd-step',
    scrollTo: { behavior: 'smooth', block: 'center' }
  }
};

export function useTour(tourName) {
  const tour = useShepherd(defaultTourOptions);

  // Función que prepara los pasos (la hemos extraído para no repetir código)
  const prepareSteps = (stepsConfig) => {
    return stepsConfig.map(step => {
      if (step.buttons) {
        step.buttons.forEach(button => {
          const actionName = button.action; 
          if (tour[actionName]) {
            button.action = tour[actionName];
          }
        });
      }
      return step;
    });
  };

  /**
   * Inicia el tour SÓLO si no se ha completado antes.
   * Ideal para la carga inicial de la página.
   */
  const startTourIfNeeded = (stepsConfig) => {
    const tourCompleted = localStorage.getItem(`tourCompleted_${tourName}`);
    if (tourCompleted) return;

    const steps = prepareSteps(stepsConfig);
    tour.addSteps(steps);
    tour.on('complete', markTourAsCompleted);
    tour.on('cancel', markTourAsCompleted);
    tour.start();
  };

  /**
   * Inicia el tour INCONDICIONALMENTE.
   * Ideal para el botón de ayuda.
   */
  const forceStartTour = (stepsConfig) => {
    // Si el tour ya está activo, no hacemos nada para evitar duplicados
    if (tour.isActive()) return;
    
    // Reseteamos los pasos por si ya estaban añadidos
    tour.steps = [];
    const steps = prepareSteps(stepsConfig);
    tour.addSteps(steps);

    // No necesitamos los listeners de 'complete' aquí, porque no queremos
    // volver a marcarlo como visto. El usuario puede querer verlo de nuevo.
    tour.start();
  }

  const markTourAsCompleted = () => {
    localStorage.setItem(`tourCompleted_${tourName}`, 'true');
    tour.off('complete', markTourAsCompleted);
    tour.off('cancel', markTourAsCompleted);
  };
  
  // La función de reseteo ya no es necesaria para la UI, pero la dejamos por si es útil internamente.
  const resetTour = () => {
    localStorage.removeItem(`tourCompleted_${tourName}`);
  };

  return {
    startTourIfNeeded, // La que usaremos en onMounted
    forceStartTour,   // La que usaremos desde el store
    resetTour
  };
}