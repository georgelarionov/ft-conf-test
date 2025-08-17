import React, { createContext, useContext, useState } from 'react';
import { Step, STEPS, UserSession } from 'type';
import { steps, stepsOrder } from './steps';

const SessionContext = createContext<{
  currentStep: Step;
  nextStep: () => void;
  goStep: (step: STEPS) => void;
  prevStep: () => void;
  session: UserSession;
  setSession: (data: any) => void;
}>({
  currentStep: {} as Step,
  nextStep: () => {},
  goStep: () => {},
  prevStep: () => {},
  setSession: () => {},
  session: {} as UserSession,
});

export const SessionProvider = ({ children }) => {
  const [state, setState] = useState({
    currentStep: {
      ...steps[stepsOrder[0].step],
      step: stepsOrder[0].step,
      disabled: true,
    },
    session: {
      light: {
        exposition: 1,
        renderMap: 'renderMaps/Venice Sunset/map.hdr',
      },
      video: {
        duration: 3,
        rotateCount: 1,
      },
    } as UserSession,
  });

  const nextStep = () => {
    const currentStepIndex = stepsOrder.findIndex(
      ({ step, children = [] }) =>
        step === state.currentStep.step ||
        children.includes(state.currentStep.step)
    );
    const nextStep =
      stepsOrder[currentStepIndex + 1] && stepsOrder[currentStepIndex + 1].step;
    if (currentStepIndex >= stepsOrder.length - 1) return;
    setState(prev => ({
      ...prev,
      currentStep: {
        ...steps[nextStep],
        step: nextStep,
        disabled: currentStepIndex + 1 === stepsOrder.length - 1,
      },
    }));
  };

  const prevStep = () => {
    const currentStepIndex = stepsOrder.findIndex(
      ({ step, children = [] }) =>
        step === state.currentStep.step ||
        children.includes(state.currentStep.step)
    );
    const parentOfCurrentStep = stepsOrder.find(({ children = [] }) =>
      children.find(child => child === state.currentStep.step)
    );

    if (parentOfCurrentStep) {
      setState(prev => ({
        ...prev,
        currentStep: {
          ...steps[parentOfCurrentStep.step],
          step: parentOfCurrentStep.step,
          disabled: currentStepIndex - 1 === 0,
        },
      }));
      return;
    }
    const prevStep =
      stepsOrder[currentStepIndex - 1] && stepsOrder[currentStepIndex - 1].step;
    if (currentStepIndex < 1) return;
    setState(prev => ({
      ...prev,
      currentStep: {
        ...steps[prevStep],
        step: prevStep,
        disabled: currentStepIndex - 1 === 0,
      },
    }));
  };

  const goStep = (step: STEPS) => {
    const chosenStep = steps[step];
    if (!chosenStep) return;
    setState(prev => ({ ...prev, currentStep: { ...chosenStep, step } }));
  };

  const setSession = (data = {}) => {
    setState(prev => ({ ...prev, session: { ...prev.session, ...data } }));
  };

  return (
    <SessionContext.Provider
      value={{
        currentStep: state.currentStep,
        session: state.session,
        nextStep,
        goStep,
        prevStep,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
