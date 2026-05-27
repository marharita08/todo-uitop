'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreateTodoDto, createTodoSchema } from '@/core/schemas';
import { useTodoCreateMutation } from '@/hooks/use-todo-create-mutation';

import { CategorySelect } from '../category/category-select';

export function TodoCreateDialog() {
  const [open, setOpen] = useState(false);

  const { mutate: createTodo, isPending } = useTodoCreateMutation();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateTodoDto>({
    resolver: zodResolver(createTodoSchema),
  });

  const categoryId = useWatch({
    control: control,
    name: 'categoryId',
  });

  const onSubmit = (dto: CreateTodoDto) => {
    createTodo(dto, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add task
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="text">Task</Label>
            <Input
              id="text"
              placeholder="Enter task description..."
              aria-invalid={!!errors.text}
              {...register('text')}
            />
            {errors.text && <p className="text-destructive text-xs">{errors.text.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <CategorySelect
              value={categoryId ? String(categoryId) : undefined}
              onValueChange={(val) => setValue('categoryId', Number(val), { shouldValidate: true })}
              placeholder="Select category"
            />
            {errors.categoryId && (
              <p className="text-destructive text-xs">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
