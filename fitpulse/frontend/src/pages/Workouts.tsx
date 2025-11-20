import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Workout {
    _id: string;
    exercise: string;
    duration: number;
    calories: number;
    date: string;
    notes?: string;
}

export default function Workouts() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm<Workout>();

    const fetchWorkouts = async () => {
        try {
            const { data } = await api.get('/workouts');
            setWorkouts(data);
        } catch (error) {
            console.error("Failed to fetch workouts", error);
        }
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const onSubmit = async (data: Workout) => {
        try {
            if (editingId) {
                await api.put(`/workouts/${editingId}`, data);
            } else {
                await api.post('/workouts', data);
            }
            fetchWorkouts();
            reset();
            setIsAdding(false);
            setEditingId(null);
        } catch (error) {
            console.error("Failed to save workout", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            try {
                await api.delete(`/workouts/${id}`);
                fetchWorkouts();
            } catch (error) {
                console.error("Failed to delete workout", error);
            }
        }
    };

    const handleEdit = (workout: Workout) => {
        setEditingId(workout._id);
        setIsAdding(true);
        setValue('exercise', workout.exercise);
        setValue('duration', workout.duration);
        setValue('calories', workout.calories);
        setValue('date', workout.date.split('T')[0]);
        setValue('notes', workout.notes);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Workouts</h2>
                <Button onClick={() => { setIsAdding(!isAdding); setEditingId(null); reset(); }}>
                    {isAdding ? 'Cancel' : <><Plus className="mr-2 h-4 w-4" /> Add Workout</>}
                </Button>
            </div>

            {isAdding && (
                <Card>
                    <CardHeader>
                        <CardTitle>{editingId ? 'Edit Workout' : 'Add New Workout'}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="exercise">Exercise Name</Label>
                                    <Input id="exercise" {...register('exercise', { required: true })} placeholder="e.g. Running" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (min)</Label>
                                    <Input id="duration" type="number" {...register('duration', { required: true })} placeholder="30" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="calories">Calories Burned</Label>
                                    <Input id="calories" type="number" {...register('calories', { required: true })} placeholder="300" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date</Label>
                                    <Input id="date" type="date" {...register('date', { required: true })} defaultValue={new Date().toISOString().split('T')[0]} />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input id="notes" {...register('notes')} placeholder="Optional notes..." />
                                </div>
                            </div>
                            <Button type="submit" className="w-full md:w-auto">
                                {editingId ? 'Update Workout' : 'Save Workout'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workouts.map((workout) => (
                    <Card key={workout._id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">{workout.exercise}</CardTitle>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(workout)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(workout._id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-2">
                                {new Date(workout.date).toLocaleDateString()}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>{workout.duration} min</span>
                                <span>{workout.calories} kcal</span>
                            </div>
                            {workout.notes && (
                                <div className="mt-2 text-xs text-gray-500">
                                    {workout.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
