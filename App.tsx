
import React, { useState, useEffect } from 'react';
import { DualTerminalView } from './components/DualTerminalView';
import { GLOSSARY_TERMS, TRAINING_SCENARIOS, RESOURCE_MODULES, Icon } from './constants';
import type { TrainingScenario, ResourceModule, GlossaryTerm, LogEntry } from './types';

// ============================================================================
// Main App Component
// ============================================================================

export default function App() {
    const [activeTab, setActiveTab] = useState('inicio');
    const [logEntries, setLogEntries] = useState<LogEntry[]>([
        { id: 0, timestamp: new Date().toLocaleTimeString(), source: 'System', message: 'Simulación iniciada. Ambos equipos están activos.', teamVisible: 'all' }
    ]);

    const addLogEntry = (log: Omit<LogEntry, 'id' | 'timestamp'>) => {
        setLogEntries(prev => [
            ...prev,
            {
                ...log,
                id: prev.length,
                timestamp: new Date().toLocaleTimeString(),
            }
        ]);
    };


    return (
        <div className="flex flex-col min-h-screen">
            <Header activeTab={activeTab} />
            <main className="container mx-auto p-4 md:p-8 mt-4 md:mt-8 flex-grow">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabContent activeTab={activeTab} logEntries={logEntries} addLogEntry={addLogEntry} />
            </main>
            <Footer />
        </div>
    );
}

// ============================================================================
// Layout Components
// ============================================================================

const Header: React.FC<{ activeTab: string }> = ({ activeTab }) => {
    const tabs = ['inicio', 'capacitacion', 'recursos', 'terminal'];
    const tabIndex = tabs.indexOf(activeTab);
    const progressWidth = ((tabIndex + 1) / tabs.length) * 100;

    return (
        <header className="glass-morphism shadow-2xl relative bg-[rgba(45,80,22,0.85)] backdrop-blur-xl border border-[rgba(184,134,11,0.3)]">
            <div className="container mx-auto px-4 py-4 md:px-6 md:py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        <div className="p-2 bg-gray-900/50 rounded-lg shadow-lg flex-shrink-0">
                            <img 
                                src="https://cybervaltorix.com/wp-content/uploads/2025/09/Logo-Valtorix-1.png" 
                                alt="Logo Cyber Valtorix" 
                                className="h-10 w-10 md:h-12 md:w-12 object-contain"
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/48x48/2d5016/b8860b?text=CV')}
                            />
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-white">CYBER VALTORIX</h1>
                            <p className="text-yellow-200 text-xs sm:text-sm font-medium">Taller de Inducción SOC</p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-3">
                        <div className="bg-gradient-to-r from-[var(--cv-gold)] to-[var(--accent-gold)] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg font-bold text-sm sm:text-base transition-all duration-300 ease-in-out hover:shadow-xl hover:brightness-110 hover:-translate-y-0.5 cursor-pointer">
                            CISO INSTRUCTOR
                        </div>
                        <p className="text-yellow-200 text-xs mt-1">Nivel: Pasante</p>
                    </div>
                </div>
            </div>
            <div 
                className="h-1 bg-gradient-to-r from-[var(--cv-dark-green)] to-[var(--cv-gold)] rounded-r-full transition-all duration-500 ease-out" 
                style={{ width: `${progressWidth}%` }}
                id="progress-bar"
            ></div>
        </header>
    );
};

const Footer: React.FC = () => (
    <footer className="text-center py-8 px-4">
        <div className="glass-morphism rounded-xl p-6 max-w-2xl mx-auto bg-[rgba(45,80,22,0.85)] backdrop-blur-xl border border-[rgba(184,134,11,0.3)]">
            <p className="text-white text-sm font-medium mb-2">CYBER VALTORIX S.A. DE C.V.</p>
            <p className="text-gray-400 text-xs">Plataforma de Inducción del Centro de Operaciones de Seguridad (SOC)</p>
        </div>
    </footer>
);


// ============================================================================
// Tab Navigation and Content
// ============================================================================

const TABS_CONFIG = [
    { id: 'inicio', icon: 'book-open', label: 'Inicio (Glosario)' },
    { id: 'capacitacion', icon: 'graduation-cap', label: 'Capacitación SOC' },
    { id: 'recursos', icon: 'library', label: 'Recursos' },
    { id: 'terminal', icon: 'terminal', label: 'Terminal (Simulada)' },
];

const Tabs: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
    const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const activeTabIndex = TABS_CONFIG.findIndex(tab => tab.id === activeTab);
        if (window.innerWidth < 768 && tabRefs.current[activeTabIndex]) {
            tabRefs.current[activeTabIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        }
    }, [activeTab]);

    return (
        <div className="mb-8 sticky top-0 md:top-auto md:relative z-50 -mx-4 px-4 py-3 bg-[var(--cv-dark-green)]/90 backdrop-blur-lg md:bg-transparent md:backdrop-blur-none md:-mx-0 md:px-0 md:py-0">
            <nav className="flex overflow-x-auto whitespace-nowrap space-x-3 md:flex-wrap md:gap-3 md:space-x-0 nav-tabs scrollbar-hide" aria-label="Tabs">
                {TABS_CONFIG.map((tab, index) => (
                    <button
                        key={tab.id}
                        ref={el => { tabRefs.current[index] = el; }}
                        onClick={() => setActiveTab(tab.id)}
                        className={`nav-tab flex-shrink-0 p-3 md:p-4 md:px-6 rounded-xl font-semibold transition-all duration-300 ease-out flex items-center justify-center md:justify-start
                            ${activeTab === tab.id
                                ? 'bg-gradient-to-r from-[var(--cv-dark-green)] to-[var(--cv-gold)] text-white transform -translate-y-0.5 shadow-lg shadow-[rgba(184,134,11,0.4)]'
                                : 'bg-[rgba(85,107,47,0.6)] text-slate-300 border border-[rgba(184,134,11,0.2)] hover:bg-[rgba(184,134,11,0.1)] hover:-translate-y-px hover:border-[var(--cv-gold)]'
                            }`}
                    >
                        <Icon name={tab.icon} className="h-5 w-5 mr-0 md:mr-2" />
                        <span className="hidden md:inline">{tab.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

interface TabContentProps {
    activeTab: string;
    logEntries: LogEntry[];
    addLogEntry: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab, logEntries, addLogEntry }) => {
    const [currentTab, setCurrentTab] = useState(activeTab);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        if (activeTab !== currentTab) {
            setIsFading(true);
            setTimeout(() => {
                setCurrentTab(activeTab);
                setIsFading(false);
            }, 150);
        }
    }, [activeTab, currentTab]);


    const renderContent = () => {
        switch (currentTab) {
            case 'inicio': return <GlossarySection />;
            case 'capacitacion': return <TrainingSection />;
            case 'recursos': return <ResourcesSection />;
            case 'terminal': return <DualTerminalView logEntries={logEntries} addLogEntry={addLogEntry} />;
            default: return null;
        }
    };
    return <div className={`transition-opacity duration-150 ${isFading ? 'opacity-0' : 'opacity-100'}`}>{renderContent()}</div>;
};

// ============================================================================
// Content Sections
// ============================================================================

const SectionWrapper: React.FC<{ children: React.ReactNode, title: string, subtitle: string, className?: string }> = ({ children, title, subtitle, className }) => (
    <div className={`glass-morphism p-6 md:p-8 rounded-2xl shadow-2xl bg-[rgba(45,80,22,0.85)] backdrop-blur-xl border border-[rgba(184,134,11,0.3)] ${className}`}>
        <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">{title}</h2>
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">{subtitle}</p>
        </div>
        {children}
    </div>
);

const GlossarySection: React.FC = () => (
    <SectionWrapper title="Glosario de Inducción del SOC" subtitle='Su vocabulario fundamental. Revise la pestaña "Recursos" para explicaciones detalladas.'>
        <CisoCard icon="book-open-check" title="Términos Fundamentales">
             <dl className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {GLOSSARY_TERMS.map(term => (
                    <React.Fragment key={term.term}>
                        <dt className="text-[var(--text-primary)] font-semibold">{term.term}</dt>
                        <dd className="text-[var(--text-secondary)] text-sm ml-4 mb-2 border-l-2 border-[var(--cv-gold)] pl-3">{term.definition}</dd>
                    </React.Fragment>
                ))}
            </dl>
        </CisoCard>
    </SectionWrapper>
);

const TrainingSection: React.FC = () => (
    <SectionWrapper title="Talleres de Operaciones de Seguridad (SOC) - Nivel Pasante" subtitle="DE: CISO, CYBER VALTORIX S.A. DE C.V.">
         <div className="learning-module bg-[rgba(45,80,22,0.4)] backdrop-blur-md border-2 border-[rgba(184,134,11,0.3)] rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-green-300 mb-6 flex items-center">
                <Icon name="info" className="h-6 w-6 mr-2" />
                Instrucciones de los Talleres
            </h3>
            <CisoCard>
                <p>Tienen tiempo asignado para completar estos escenarios. Los documentos en la pestaña "Recursos" son su base teórica. Esta es la aplicación práctica.</p>
                <br />
                <p>No busquen "la respuesta correcta". Quiero su análisis, su proceso de pensamiento y las acciones de contención que proponen. Usen el modelo "Maestro/Estudiante": preparen su solución y estén listos para defenderla.</p>
            </CisoCard>
        </div>
        <div className="space-y-4">
          {TRAINING_SCENARIOS.map(scenario => <TrainingModule key={scenario.id} scenario={scenario} />)}
        </div>
    </SectionWrapper>
);

const ResourcesSection: React.FC = () => (
    <SectionWrapper title="Biblioteca de Recursos del SOC" subtitle="Análisis detallado de los conceptos clave. Use esto para resolver los escenarios de capacitación.">
        <div className="space-y-6">
            {RESOURCE_MODULES.map(resource => <LearningModule key={resource.id} resource={resource} />)}
        </div>
    </SectionWrapper>
);

// ============================================================================
// Reusable UI Components
// ============================================================================

interface CisoCardProps {
    children: React.ReactNode;
    title?: string;
    icon?: string;
}
const CisoCard: React.FC<CisoCardProps> = ({ children, title, icon }) => (
    <div className="bg-[rgba(85,107,47,0.25)] backdrop-blur-md border border-[rgba(184,134,11,0.3)] rounded-xl p-4 sm:p-6 mb-6 last:mb-0 transition-all duration-300 hover:bg-[rgba(85,107,47,0.4)] hover:border-[rgba(184,134,11,0.5)]">
        {title && (
            <h4 className="text-[var(--cv-gold)] font-bold text-lg mb-3 flex items-center">
                {icon && <Icon name={icon} className="h-5 w-5 mr-2 flex-shrink-0" />}
                {title}
            </h4>
        )}
        <div className="text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed space-y-4 prose prose-invert prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-pre:my-2 prose-code:text-amber-300 prose-code:bg-black/30 prose-code:p-1 prose-code:rounded-md prose-code:font-mono prose-code:before:content-none prose-code:after:content-none">
            {children}
        </div>
    </div>
);

const CollapsibleModule: React.FC<{
    header: React.ReactNode;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    className?: string;
    isExpanded: boolean;
    toggle: () => void;
}> = ({ header, children, className, isExpanded, toggle }) => {
    const contentRef = React.useRef<HTMLDivElement>(null);

    return (
        <div className={`bg-[rgba(45,80,22,0.4)] backdrop-blur-md border-2 rounded-2xl transition-all duration-300 hover:border-[var(--cv-gold)] hover:shadow-2xl hover:shadow-[rgba(184,134,11,0.2)] hover:-translate-y-1 ${isExpanded ? 'border-[var(--cv-gold)]' : 'border-[rgba(184,134,11,0.3)]'} ${className}`}>
            <div className="p-4 md:p-6">
                <div className="flex items-center justify-between cursor-pointer" onClick={toggle}>
                    {header}
                    <Icon name="chevron-down" className={`h-5 w-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                 <div
                    ref={contentRef}
                    className="overflow-hidden transition-[max-height] duration-700 ease-in-out"
                    style={{ maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : '0px' }}
                >
                    <div className="mt-4 pt-4 border-t border-[rgba(184,134,11,0.2)]">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrainingModule: React.FC<{ scenario: TrainingScenario }> = ({ scenario }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(scenario.status === 'Completado');
    const [progress, setProgress] = useState(scenario.status === 'Completado' ? 100 : 0);
    // In a real app, progress would be driven by global state updated from the terminal. This is a visual stand-in.
    
    useEffect(() => {
      // Simulate progress for active modules
      if (scenario.status === 'Activo' && !isCompleted && isExpanded) {
        const handle = setTimeout(() => setProgress(33), 1000);
        return () => clearTimeout(handle);
      }
    }, [scenario.status, isCompleted, isExpanded]);

    const handleToggleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCompleted(!isCompleted);
    };

    const statusConfig: { [key: string]: string } = {
        'Activo': 'bg-blue-500/20 text-blue-300',
        'Pendiente': 'bg-gray-500/20 text-gray-400',
        'Completado': 'bg-green-500/20 text-green-300'
    };
    
    const currentStatus = isCompleted ? 'Completado' : scenario.status;

    return (
        <CollapsibleModule
            isExpanded={isExpanded}
            toggle={() => setIsExpanded(!isExpanded)}
            header={
                <>
                    <div className="flex items-center space-x-4 flex-grow min-w-0">
                        <div className={`w-12 h-12 ${scenario.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon name={scenario.icon} className={`h-6 w-6 ${scenario.color.replace('bg-', 'text-').replace('-500','-400')}`} />
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-white truncate">{scenario.title}</h4>
                            <p className="text-sm text-gray-400">{scenario.subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs sm:text-sm hidden sm:inline ${statusConfig[currentStatus]}`}>{currentStatus}</span>
                        <button 
                            onClick={handleToggleComplete}
                            title="Marcar como completado"
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border
                                ${isCompleted 
                                    ? 'bg-green-500 border-green-500 text-white' 
                                    : 'bg-white/10 border-white/30 text-gray-300 hover:bg-white/20 hover:border-[var(--cv-gold)]'
                                }`}
                        >
                            <Icon name="check" className="h-4 w-4" />
                        </button>
                    </div>
                </>
            }
        >
            <div className="mb-4 px-1">
                <span className="text-xs font-medium text-gray-300">Progreso del Escenario (Simulado)</span>
                <div className="w-full bg-gray-900/50 rounded-full h-2.5 mt-1">
                    <div className="bg-[var(--cv-gold)] h-2.5 rounded-full transition-all duration-500" style={{ width: `${isCompleted ? 100 : progress}%` }}></div>
                </div>
            </div>
            {scenario.content}
        </CollapsibleModule>
    );
};

const LearningModule: React.FC<{ resource: ResourceModule }> = ({ resource }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <CollapsibleModule
            isExpanded={isExpanded}
            toggle={() => setIsExpanded(!isExpanded)}
            header={
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-green-300 flex items-center">
                        <Icon name={resource.icon} className="h-6 w-6 mr-3"/>
                        {resource.title}
                    </h3>
                </div>
            }
        >
            {resource.content}
        </CollapsibleModule>
    );
};
