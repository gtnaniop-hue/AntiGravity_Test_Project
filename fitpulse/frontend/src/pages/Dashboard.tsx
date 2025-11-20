import { useEffect, useState } from 'react';
import api from '@/api/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Timer, Dumbbell, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [weeklySummary, setWeeklySummary] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dailyRes, weeklyRes] = await Promise.all([
                    api.get('/summary/daily'),
                    api.get('/summary/weekly')
                ]);
                setSummary(dailyRes.data);
                setWeeklySummary(weeklyRes.data);
            } catch (error) {
                console.error("Failed to fetch summary", error);
            }
        };
        fetchData();
    }, []);

    const cards = [
        {
            title: "Calories Burned",
            value: summary?.totalCalories || 0,
            icon: Flame,
            color: "text-orange-500"
        },
        {
            title: "Workout Duration",
            value: `${summary?.totalDuration || 0} min`,
            icon: Timer,
            color: "text-blue-500"
        },
        {
            title: "Workouts Today",
            value: summary?.workoutCount || 0,
            icon: Dumbbell,
            color: "text-green-500"
        },
        {
            title: "Weekly Calories",
            value: weeklySummary?.totalCalories || 0,
            icon: Trophy,
            color: "text-purple-500"
        }
    ];

    const chartData = weeklySummary?.workouts ? weeklySummary.workouts.map((w: any) => ({
        name: new Date(w.date).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: w.calories
    })) : [];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Weekly Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="calories" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {weeklySummary?.workouts?.slice(0, 5).map((workout: any) => (
                                <div key={workout._id} className="flex items-center">
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{workout.exercise}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {workout.duration} min • {workout.calories} cal
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">
                                        {new Date(workout.date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
