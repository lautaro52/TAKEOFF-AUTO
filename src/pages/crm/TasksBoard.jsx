import React from 'react';

const TasksBoard = () => {
    return (
        <div className="tasks-board-page">
            <header className="page-header">
                <h1>Tablero de Tareas</h1>
            </header>
            <div className="content-card">
                <p style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    El tablero de gestión de tareas estará disponible próximamente.
                    <br />
                    Puede ver las tareas en el dashboard y en el detalle de cada cliente.
                </p>
            </div>
        </div>
    );
};

export default TasksBoard;
