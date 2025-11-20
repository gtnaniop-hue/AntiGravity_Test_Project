import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckCircle } from 'lucide-react';

interface Goal {
    _id: string;
    type: 'weight' | 'calories' | 'workout_frequency';
    targetValue: number;
    deadline?: string;
    isAchieved: boolean;
}

export default function Goals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const { register, handleSubmit, reset } = useForm<Goal>();

    const fetchGoals = async () => {
        try {
            const { data } = await api.get('/goals');
            setGoals(data);
        } catch (error) {
            console.error("Failed to fetch goals", error);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const onSubmit = async (data: Goal) => {
        try {
            await api.post('/goals', data);
            fetchGoals();
            reset();
        } catch (error) {
            console.error("Failed to save goal", error);
        }
    };

    const toggleAchieved = async (goal: Goal) => {
        try {
            await api.put(`/goals/${goal._id}`, { isAchieved: !goal.isAchieved });
            fetchGoals();
        } catch (error) {
            console.error("Failed to update goal", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Goals</h2>

            <Card>
                <CardHeader>
                    <CardTitle>Set New Goal</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="type">Goal Type</Label>
                            <select
                                id="type"
                                {...register('type', { required: true })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="weight">Target Weight (kg)</option>
                                <option value="calories">Daily Calories Burned</option>
                                <option value="workout_frequency">Weekly Workouts</option>
                            </select>
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="targetValue">Target Value</Label>
                            <Input id="targetValue" type="number" {...register('targetValue', { required: true })} placeholder="e.g. 70" />
                        </div>
                        <div className="space-y-2 flex-1">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input id="deadline" type="date" {...register('deadline')} />
                        </div>
                        <Button type="submit">Add Goal</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                    <Card key={goal._id} className={goal.isAchieved ? "bg-green-50 dark:bg-green-900/20 border-green-200" : ""}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium capitalize">
                                {goal.type.replace('_', ' ')}
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold mb-2">
                                {goal.targetValue}
                                <span className="text-sm font-normal text-muted-foreground ml-1">
                                    {goal.type === 'weight' ? 'kg' : goal.type === 'calories' ? 'kcal' : 'times'}
                                </span>
                            </div>
                            {goal.deadline && (
                                <p className="text-xs text-muted-foreground mb-4">
                                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                </p>
                            )}
                            <Button
                                variant={goal.isAchieved ? "outline" : "default"}
                                size="sm"
                                className="w-full"
                                onClick={() => toggleAchieved(goal)}
                            >
                                {goal.isAchieved ? <><CheckCircle className="mr-2 h-4 w-4" /> Completed</> : "Mark as Achieved"}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
