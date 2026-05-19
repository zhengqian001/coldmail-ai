import { supabase } from './supabase';

export async function checkDailyLimit(userId: string): Promise<{ allowed: boolean; count: number }> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('daily_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (error || !data) {
    return { allowed: true, count: 0 };
  }

  return { allowed: data.count < 3, count: data.count };
}

export async function incrementDailyUsage(userId: string): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  const { data } = await supabase
    .from('daily_usage')
    .select('id, count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (data) {
    await supabase
      .from('daily_usage')
      .update({ count: data.count + 1 })
      .eq('id', data.id);
  } else {
    await supabase
      .from('daily_usage')
      .insert({ user_id: userId, date: today, count: 1 });
  }
}

export async function getUserPlan(userId: string): Promise<'free' | 'pro'> {
  const { data } = await supabase
    .from('users')
    .select('plan')
    .eq('id', userId)
    .single();

  return (data?.plan as 'free' | 'pro') ?? 'free';
}
